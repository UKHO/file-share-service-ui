import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalService } from "@azure/msal-angular";

import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult } from '@azure/msal-browser';
@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  userName: string;

  constructor(private msalService: MsalService) {
    super();
  }

  ngOnInit(): void {

    this.msalService.instance.handleRedirectPromise().then(res => {
      console.log("called in promise", res);
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        console.log("from header component", this.userName);
      }
    });

    this.branding = {
      title: AppConfigService.settings["fssConfig"].fssTitle,
      logoImgUrl: "https://design.ukho.dev/svg/Admiralty%20stacked%20logo.svg",
      logoAltText: "Admiralty - Maritime Data Solutions Logo",
      logoLinkUrl: "https://datahub.admiralty.co.uk/portal/apps/sites/#/marine-data-portal"
    };

    this.menuItems = [
      {
        title: 'Search'
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
        const tenantName = AppConfigService.settings["b2cConfig"].tenantName;
        let editProfileFlowRequest = {
          scopes: ["openid", AppConfigService.settings["b2cConfig"].clientId],
          authority: "https://" + tenantName + ".b2clogin.com/" + tenantName + ".onmicrosoft.com/" + AppConfigService.settings["b2cConfig"].editProfile,
        };
        this.msalService.loginRedirect(editProfileFlowRequest);
      })
    }
  }
}