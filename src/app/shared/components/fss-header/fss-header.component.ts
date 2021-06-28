import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  userName: string = "";
  @Output() isPageOverlay = new EventEmitter<boolean>();

  constructor(private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService) {
    super();
  }

  ngOnInit(): void {
    this.handleSignIn();
    /**The msalBroadcastService runs whenever an msalService with a Intercation is executed in the web application. */
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.Login))
      .subscribe(() => {
        this.isPageOverlay.emit(true);
      });


    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.isPageOverlay.emit(false);
        this.handleSigninAwareness();
      });

      this.msalBroadcastService.msalSubject$
      .pipe(
        // Optional filtering of events.
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE),
      )
      .subscribe((result: EventMessage) => {
        this.route.navigate(['']);
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
        clickAction: (() => {
          if(this.authOptions?.isSignedIn()){
            this.route.navigate(["search"]) 
          }
          if(!this.authOptions?.isSignedIn()){
            this.logInPopup();
          }
        })
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
    this.isPageOverlay.emit(true);
    this.msalService.loginPopup().subscribe(response => {
      console.log("response after login", response);
      if (response != null && response.account != null) {
        this.isPageOverlay.emit(false);
        this.msalService.instance.setActiveAccount(response.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
        console.log("from header component", this.userName);
        this.route.navigate(["search"]);
      }
    });
  }

  handleSignIn() {
    this.route.events.pipe (
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { const url = `${event.url}`
      if(url.includes('search')){
        if(!this.authOptions?.isSignedIn()){
          this.route.navigate(['']);
        }
      }
  });
  }

  /** Extract claims of user once user is Signed in */
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

  /**Once signed in handles user redirects and also handle expiry if token expires.*/
  handleSigninAwareness() {
    const date = new Date()
    const account = this.msalService.instance.getAllAccounts()[0];
    console.log("Account: ", account);
    if (account != null) {
      this.getClaims(account.idTokenClaims);
      if (localStorage['claims'] != null) {
        const claims = JSON.parse(localStorage['claims']);
        if (this.userName == claims['given_name']) {
          this.msalService.instance.setActiveAccount(account);
          if (this.authOptions?.isSignedIn()) {
            console.log("Expires On", new Date(1000 * claims['exp']));
            // Handling token expiry
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