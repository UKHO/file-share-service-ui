import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-fss-home',
  templateUrl: './fss-home.component.html',
  styleUrls: ['./fss-home.component.scss']
})
export class FssHomeComponent implements OnInit {
  name: string;
  constructor(private msalService: MsalService) { }

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(res => {
      console.log(res);
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account);
        var acc_details = this.msalService.instance.getActiveAccount();

        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        console.log(this.name);
        //   this.authOptions =
        //   {
        //     signInButtonText: this.name,
        //     signInHandler: (() => { this.msalService.loginRedirect(); }),
        //     signOutHandler: (() => { this.msalService.logout();}),
        //     isSignedIn: (() => { return true }),
        //     userProfileHandler: (() => { this.route.navigate(["search-div"]) })
        //   }
      }
    })
  }
  Signin() {
    this.msalService.loginRedirect();
  }

  getClaims(claims: any) {

    this.name = claims ? claims['given_name'] : null;

  }
}
