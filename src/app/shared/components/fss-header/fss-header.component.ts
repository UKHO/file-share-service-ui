import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult, InteractionStatus, PopupRequest, SilentRequest } from '@azure/msal-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SignInClicked } from '../../../core/services/signInClick.service';
import { Subscription } from 'rxjs';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';

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
  searchTitle: string = "Search"
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
  configPrivilegedUserDomains: string[];
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService,
    private analyticsService: AnalyticsService,
    private signInButtonService: SignInClicked,
    private essUploadFileService: EssUploadFileService) {

    this.fssTokenScope = AppConfigService.settings["fssConfig"].apiScope;
    this.configPrivilegedUserDomains = AppConfigService.settings["essConfig"].privilegedUserDomains;
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
    this.monitorNavigation();
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

    this.handleSigninAwareness();
  }

  setSkipToContent() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { this.skipToContent = `#mainContainer`; });
  }


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
        this.analyticsService.login();
      }
    });
  }

  monitorNavigation() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = `${event.url}`.toLocaleLowerCase();
      console.log("Navigation", url)
      if (url.includes('search')) {
        if (!this.userSignedIn) {
          this.route.navigate(['']);
          this.isActive = false;
          this.essActive = false;
          this.searchActive = true;
        }
        else {
          this.isActive = true;
          this.essActive = false;
          this.searchActive = true;
        }
      }
      else if (url.includes('exchangesets')) {
        this.essActive = true;
        this.searchActive = false;
      }
      else if (url.includes('logout')) {
        console.log("Logging out...");
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

  handleUserProfileClick() {
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
    this.route.navigate(["exchangesets"]);
  }

  menuSearchClick() {
    this.route.navigate(["simpleSearch"])
  }


  /** Extract claims of user once user is Signed in */
  getClaims(claims: any) {
    this.firstName = claims ? claims['given_name'] : null;
    this.lastName = claims ? claims['family_name'] : null;
    this.userName = this.firstName + ' ' + this.lastName;
    this.signedInName = this.userName;
    
    const email = claims ? claims['email'] : null;
    this.configPrivilegedUserDomains.forEach(configPrivilegedUserDomain => {
      if (email && (email.toLowerCase().endsWith(configPrivilegedUserDomain.toLowerCase()))) {
        this.essUploadFileService.isPrivilegedUser = true;
      }
    })
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
  }

  ngOnDestroy(): void {
    this.clickSub.unsubscribe();
  }

}



