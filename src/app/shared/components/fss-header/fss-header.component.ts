import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  userName: string = "";
  skipToContent: string = "";
  firstName: string = '';
  lastName: string = '';
  constructor(private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService) {
    super();
  }

  ngOnInit(): void {
    this.setSkipToContent();
    this.msalBroadcastService.inProgress$
      .subscribe(() => {
        const account = this.msalService.instance.getAllAccounts()[0];
        if (account != null) {
          this.getClaims(account.idTokenClaims);
          this.msalService.instance.setActiveAccount(account);
        }
      });

    this.branding = {
      title: AppConfigService.settings["fssConfig"].fssTitle,
      logoImgUrl: "https://design.ukho.dev/svg/Admiralty%20stacked%20logo.svg",
      logoAltText: "Admiralty - Maritime Data Solutions Logo",
      logoLinkUrl: "https://admiralty.co.uk"
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
  }

  setSkipToContent() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { this.skipToContent = `${event.url}#mainContainer`; });
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
        this.route.navigate(["/"]);
      }
    });
  }

  getClaims(claims: any) {
    this.firstName = claims ? claims['given_name'] : null;
    this.lastName = claims ? claims['family_name'] : null;
    this.userName = this.firstName + ' ' + this.lastName;
    this.authOptions =
    {
      signInButtonText: this.userName,
      signInHandler: (() => { }),
      signOutHandler: (() => { this.msalService.logout(); }),
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
}