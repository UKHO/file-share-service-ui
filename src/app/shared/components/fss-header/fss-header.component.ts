import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";

import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  userName: string = "";

  constructor(private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService) {
    super();
  }

  ngOnInit(): void {

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.handleSigninAwareness();
      });

    this.branding = {
      title: AppConfigService.settings["fssConfig"].fssTitle,
      logoImgUrl: "https://design.ukho.dev/svg/Admiralty%20stacked%20logo.svg",
      logoAltText: "Admiralty - Maritime Data Solutions Logo",
      logoLinkUrl: "https://datahub.admiralty.co.uk/portal/apps/sites/#/marine-data-portal"
    };

    this.menuItems = [
      {
        title: 'Search',
        clickAction: (() => { this.route.navigate(["search"]) })
      }
    ];

    this.authOptions = {
      signInButtonText: 'Sign in',
      signInHandler: (() => { this.logInPopup(); }),
      signOutHandler: (() => { this.msalService.logout(); }),
      isSignedIn: (() => { return false }),
      userProfileHandler: (() => { })
    }

    this.handleSigninAwareness();
  }

  logInPopup() {
    this.msalService.loginPopup().subscribe(response => {
      console.log("response after login", response);
      if (response != null && response.account != null) {
        this.msalService.instance.setActiveAccount(response.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
        console.log("from header component", this.userName);
        this.route.navigate(["search"]);
      }
    });
  }

  getClaims(claims: any) {
    this.userName = claims ? claims['given_name'] : null;
    this.authOptions =
    {
      signInButtonText: this.userName,
      signInHandler: (() => { }),
      signOutHandler: (() => {
        this.msalService.logout();
        localStorage.clear();
      }),
      isSignedIn: (() => { return true }),
      userProfileHandler: (() => {
        const tenantName = AppConfigService.settings["b2cConfig"].tenantName;
        let editProfileFlowRequest = {
          scopes: ["openid", AppConfigService.settings["b2cConfig"].clientId],
          authority: "https://" + tenantName + ".b2clogin.com/" + tenantName + ".onmicrosoft.com/" + AppConfigService.settings["b2cConfig"].editProfile,
        };
        this.msalService.loginPopup(editProfileFlowRequest).subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          this.getClaims(response.idTokenClaims);
        });;
      })
    }
  }

  setIdToken() {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('idtoken')) {
        var token = JSON.parse(localStorage[key]);
        localStorage.setItem('idToken', token['secret']);
      }
    });
  }

  handleSigninAwareness() {
    const date = new Date()
    const account = this.msalService.instance.getAllAccounts()[0];
    if (account != null) {
      this.getClaims(account.idTokenClaims);
      if (localStorage['claims'] == null) {
        this.setIdToken();
        localStorage.setItem('claims', JSON.stringify(account.idTokenClaims));
      }
      else {
        const claims = JSON.parse(localStorage['claims']);
        if (this.userName == claims['given_name']) {
          this.msalService.instance.setActiveAccount(account);
          if (this.authOptions?.isSignedIn()) {
            console.log("Expires On", new Date(1000 * claims['exp']));
            if (new Date(1000 * claims['exp']).toISOString() < date.toISOString()) {
              this.msalService.loginPopup().subscribe(response => {
                localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
                localStorage.setItem('idToken', response.idToken);
              });
            }
            this.route.navigateByUrl('/search');
          }
        }
      }
    }
  }
}