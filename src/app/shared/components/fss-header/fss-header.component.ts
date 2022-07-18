import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit {
  userName: string = "";
  @Output() isPageOverlay = new EventEmitter<boolean>();

  skipToContent: string = "";
  firstName: string = '';
  lastName: string = '';
  isActive: boolean = false;
  constructor(private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService,
    private fileShareApiService: FileShareApiService,
    private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit(): void {
    this.handleSignIn();
    this.setSkipToContent();
    this.menuItems = [
      {
        title: 'Exchange sets',
        clickAction: (() => {
          if (this.authOptions?.isSignedIn()) {
          this.route.navigate(["exchangesets"]);
          }
          if (!this.authOptions?.isSignedIn()) {
            this.logInPopup();
          }
          // localStorage.setItem('currentMenu', 'Exchange set');    
          this.handleActiveTab('Exchange sets'); //Value should be same as title
        }),
        navActive:this.isActive
      },
      {
        title: 'Search',
        clickAction: (() => {
          if (this.authOptions?.isSignedIn()) {
            this.route.navigate(["search"])
          }
          if (!this.authOptions?.isSignedIn()) {
            this.logInPopup();
          }
        }),
        navActive: this.isActive
      }
    ];
    /**The msalBroadcastService runs whenever an msalService with a Intercation is executed in the web application. */
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.Login))
      .subscribe(() => {
        this.isPageOverlay.emit(true);
      });

    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.AcquireToken))
      .subscribe(() => {
        this.isPageOverlay.emit(true);
      })

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.isPageOverlay.emit(false);
        this.handleSigninAwareness();
      });

    this.title = AppConfigService.settings["fssConfig"].fssTitle;
    this.logoImgUrl = "/assets/svg/Admiralty%20stacked%20logo.svg";
    this.logoAltText = "Admiralty - Maritime Data Solutions Logo";
    this.logoLinkUrl = "https://www.admiralty.co.uk/";

    this.authOptions = {
      signedInButtonText: 'Sign in',
      signInHandler: (() => { this.logInPopup(); }),
      signOutHandler: (() => { }),
      isSignedIn: (() => { return false }),
      userProfileHandler: (() => { })
    }
    this.handleSigninAwareness();
    this.handleActiveTab(localStorage.getItem('currentMenu'));
  }

  setSkipToContent() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { this.skipToContent = `#mainContainer`; });
  }

  handleActiveTab(title:any) {
    for (var item of this.menuItems) {
      item.navActive = false;
      if(item.title == title)
      {
         item.navActive = true;
      }
    }
  }


  logInPopup() {
    this.msalService.loginPopup().subscribe(response => {
      if (response != null && response.account != null) {
        this.msalService.instance.setActiveAccount(response.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
        this.route.navigate(['search'])
        this.isActive = true;
        this.handleActiveTab(this.menuItems[1].title)
        this.analyticsService.login();
      }
    });
  }
  
  handleSignIn() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = `${event.url}`
      if (url.includes('search')) {
        if (!this.authOptions?.isSignedIn()) {
          this.route.navigate(['']);
          this.isActive = false;
          this.handleActiveTab(this.menuItems[1].title)
        }
        else {
          this.isActive = true;
          this.handleActiveTab(this.menuItems[1].title)
        }
      }
        else if(url.includes('exchangesets')){
          this.handleActiveTab(this.menuItems[0].title)
        }
    });
  }

  /** Extract claims of user once user is Signed in */
  getClaims(claims: any) {
    this.firstName = claims ? claims['given_name'] : null;
    this.lastName = claims ? claims['family_name'] : null;
    this.userName = this.firstName + ' ' + this.lastName;
    this.authOptions =
    {
      signedInButtonText: this.userName,
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

  /**Once signed in handles user redirects and also handle expiry if token expires.*/
  handleSigninAwareness() {
    const date = new Date()
    const account = this.msalService.instance.getAllAccounts()[0];
    if (account != null) {
      this.getClaims(account.idTokenClaims);
      if (localStorage['claims'] !== undefined) {
        const claims = JSON.parse(localStorage['claims']);
        if (this.userName == claims['given_name']) {
          this.msalService.instance.setActiveAccount(account);
          if (this.authOptions?.isSignedIn()) {
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
    this.getMenuItems();
  }
  getMenuItems(){
    if(this.authOptions?.isSignedIn()){
      return this.menuItems;
    }else{
      return [];
    }
  }
}