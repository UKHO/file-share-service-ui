import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult, InteractionStatus, PopupRequest, SilentRequest } from '@azure/msal-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SignInClicked } from '../../../core/services/signInClick.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  userName: string = "";
  @Output() isPageOverlay = new EventEmitter<boolean>();

  title: string = AppConfigService.settings["fssConfig"].fssTitle;
  logoImgUrl: string = "/assets/svg/Admiralty%20stacked%20logo.svg";
  logoAltText: string = "Admiralty - Maritime Data Solutions Logo";
  logoLinkUrl: string = "https://www.admiralty.co.uk/";
  essTitle: string = "Exchange sets";
  searchTitle : string = "Search"
  userSignedIn: boolean = false;
  essActive: boolean = false;
  searchActive: boolean = true;
  signedInName = ""
  clickSub: Subscription;

  skipToContent: string = "";
  firstName: string = '';
  lastName: string = '';
  isActive: boolean = false;
  fssSilentTokenRequest: SilentRequest;
  fssTokenScope: any = [];
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService,
    private analyticsService: AnalyticsService,
    private signInButtonService: SignInClicked) {

    this.fssTokenScope = AppConfigService.settings["fssConfig"].apiScope;
    this.fssSilentTokenRequest = {
      scopes: [this.fssTokenScope],
    };

    this.clickSub = this.signInButtonService.currentstate.subscribe(state => {
      if (state == true) {
        this.signInButtonService.changeState(false);
        this.logInPopup();
      }
    });
  }
  ngAfterViewInit(): void {
    //added unique id for testing & accessibility
    // NOTE :
    // `ukho-header` does not allow to change `id` it uses `title` as a `id` changed Exchange sets -> Exchange-sets
    //const exchnageSetElem = document.querySelector('.links')?.children[0].childNodes[0] as HTMLElement;
    //if (!(exchnageSetElem instanceof Comment) && exchnageSetElem.getAttribute('id') === 'Exchange sets') {
    //  exchnageSetElem.setAttribute('id', 'Exchange-sets');
    //}
  }

  ngOnInit(): void {
    this.handleSignIn();
    this.setSkipToContent();

    

    

    /**The msalBroadcastService runs whenever an msalService with a Intercation is executed in the web application. */
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.Login))
      .subscribe(() => {
        this.isPageOverlay.emit(true);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.AcquireToken))
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

    //this.title = AppConfigService.settings["fssConfig"].fssTitle;
    //this.logoImgUrl = "/assets/svg/Admiralty%20stacked%20logo.svg";
    //this.logoAltText = "Admiralty - Maritime Data Solutions Logo";
    //this.logoLinkUrl = "https://www.admiralty.co.uk/";

    this.handleSigninAwareness();
  }

  setSkipToContent() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { this.skipToContent = `#mainContainer`; });
  }

  /*
  handleActiveTab(title: any) {
    for (var item of this.menuItems) {
      item.navActive = false;
      if (item.title == title) {
        item.navActive = true;
      }
    }
  }*/

  logInPopup() {
    this.msalService.instance.handleRedirectPromise();
    this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest).subscribe((response: AuthenticationResult) => {
      if (response != null && response.account != null) {
        this.msalService.instance.setActiveAccount(response.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
        this.route.navigate(['search'])
        this.searchActive = true;
        this.userSignedIn = true;
        //this.isActive = true;
        //this.handleActiveTab(this.menuItems[1].title)
        this.analyticsService.login();
      }
    });
  }

  handleSignIn() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = `${event.url}`
      console.log("Rhz Start sgn...", url)
      if (url.includes('search')) {
        if (!this.userSignedIn) {
          this.route.navigate(['']);
          this.isActive = false;
          //this.handleActiveTab(this.menuItems[1].title)
        }
        else {
          this.isActive = true;
          //this.handleActiveTab(this.menuItems[1].title)
        }
      }
      else if (url.includes('exchangesets')) {
        //this.handleActiveTab(this.menuItems[0].title)
      }
      else if (url.includes('logout')) {
        console.log("Rhz Attempting to navigate to Logout component");
      }
    });
  }

  handleSignInClick() {
    this.logInPopup()
  }

  handleSignOut() {
    this.userSignedIn = false;
    this.msalService.logout();
  }

  handleUserProfileClick()  {
    console.log("Rhz Profile");
    const tenantName = AppConfigService.settings["b2cConfig"].tenantName;
    let editProfileFlowRequest = {
      scopes: ["openid", AppConfigService.settings["b2cConfig"].clientId],
      authority: "https://" + tenantName + ".b2clogin.com/" + tenantName + ".onmicrosoft.com/" + AppConfigService.settings["b2cConfig"].editProfile,
    };
    this.msalService.loginPopup(editProfileFlowRequest).subscribe((response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account);
      this.getClaims(response.idTokenClaims);
    });
  }


  menuExchangeClick() {
    console.log("exchange clicked")
    this.route.navigate(["exchangesets"]);
    this.essActive = true;
    this.searchActive = false;
  }

  menuSearchClick() {
    console.log("search clicked")
    this.route.navigate(["simpleSearch"])
    this.essActive = false;
    this.searchActive = true;
  }


  /** Extract claims of user once user is Signed in */
  getClaims(claims: any) {
    this.firstName = claims ? claims['given_name'] : null;
    this.lastName = claims ? claims['family_name'] : null;
    this.userName = this.firstName + ' ' + this.lastName;

    this.signedInName = this.userName;
    
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
        }
      }
    }
    //this.getMenuItems();
  }

  /*
  getMenuItems() {
    if (this.authOptions?.isSignedIn()) {
      return this.menuItems;
    } else {
      return [];
    }
  }*/

  ngOnDestroy(): void {
    this.clickSub.unsubscribe();
  }

}


