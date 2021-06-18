import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalService } from "@azure/msal-angular";
import{ fssConfiguration } from '../../../../../appConfig';


import { AppConfigService } from 'src/app/core/services/app-config.service';
import { AuthenticationResult } from '@azure/msal-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  userName: string;

  constructor(private msalService: MsalService, private route: Router) {
    super();
  }

  ngOnInit(): void {

    this.msalService.instance.handleRedirectPromise().then(res => {
      console.log("called in promise", res);
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        console.log("from header component", this.userName);
        // this.acquireToken();
      }
    });

    this.branding = {
      title : fssConfiguration.fssTitle,
      logoImgUrl : "https://design.ukho.dev/svg/Admiralty%20stacked%20logo.svg",
      logoAltText : "Admiralty - Maritime Data Solutions Logo",
      logoLinkUrl : "https://datahub.admiralty.co.uk/portal/apps/sites/#/marine-data-portal"
    };

    this.menuItems = [
      {
        title: 'Search',
        clickAction: (() => {
          this.route.navigateByUrl('/search');
        })
      }
    ];

    this.authOptions = {
      signInButtonText: 'Sign in',
      signInHandler: (() => { this.msalService.loginRedirect(); }),
      signOutHandler: (() => { this.msalService.logout(); }),
      isSignedIn: (() => { return false }),
      userProfileHandler: (() => { })
    }
  }

  getClaims(claims: any) {
    this.userName = claims ? claims['given_name'] : null;
    this.authOptions =
    {
      signInButtonText: this.userName,
      signInHandler: (() => { this.msalService.loginRedirect(); }),
      signOutHandler: (() => { this.msalService.logout(); }),
      isSignedIn: (() => { return true }),
      userProfileHandler: (() => {
      })
    }
  }

  acquireToken() {
    const silentRequest = {
      scopes: ["openid", "profile", AppConfigService.settings["b2cConfig"].clientId, "offline_access"],
      prompt: 'none'
    }

    this.msalService.acquireTokenSilent(silentRequest).subscribe(
      {
        next: (result: AuthenticationResult) => {
          console.log("Succeded", result);
        },
        error: (error) => {
          this.msalService.loginRedirect();
        }
      });
  }
}