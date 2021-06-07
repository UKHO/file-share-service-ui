import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { Router } from '@angular/router';
import { MsalService } from "@azure/msal-angular";
@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  name: string;
  constructor(private route: Router,
    private msalService: MsalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(res => {
      console.log(res);
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account);
        //var acc_details = this.msalService.instance.getActiveAccount();

        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        console.log(this.name);
        this.authOptions =
        {
          signInButtonText: this.name,
          signInHandler: (() => { this.msalService.loginRedirect(); }),
          signOutHandler: (() => { this.msalService.logout(); }),
          isSignedIn: (() => { return true }),
          userProfileHandler: (() => {  })
        }
      }
    })

    this.branding = {
      title: "File Share Service",
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
      signOutHandler: (() => { }),
      isSignedIn: (() => { return false }),
      userProfileHandler: (() => {  })
    }
  }

  getClaims(claims: any) {
    this.name = claims ? claims['given_name'] : null;
  }
}





