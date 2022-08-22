import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthenticationResult, InteractionStatus, PopupRequest, PublicClientApplication } from '@azure/msal-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent implements OnInit, AfterViewInit {
  userName: string = "";
  @Output() isPageOverlay = new EventEmitter<boolean>();

  skipToContent: string = "";
  firstName: string = '';
  lastName: string = '';
  isActive: boolean = false;
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private route: Router,
    private msalBroadcastService: MsalBroadcastService,
    private analyticsService: AnalyticsService) {
    super();
  }
  ngAfterViewInit(): void {
    //added unique id for testing & accessibility
    // NOTE :
    // `ukho-header` does not allow to change `id` it uses `title` as a `id` changed Exchange sets -> Exchange-sets
    const exchnageSetElem = document.querySelector('.links')?.children[0].childNodes[0] as HTMLElement;
    if (!(exchnageSetElem instanceof Comment) && exchnageSetElem.getAttribute('id') === 'Exchange sets') {
      exchnageSetElem.setAttribute('id', 'Exchange-sets');
    }
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
          this.handleActiveTab('Exchange sets');
        }),
        navActive: this.isActive
      },
      {
        title: 'Search',
        clickAction: (() => {
          if (this.authOptions?.isSignedIn()) {
            this.route.navigate(["search"])
          }
        }),
        navActive: this.isActive
      }
    ];

    // let msalInstance: PublicClientApplication = this.msalService.instance as PublicClientApplication;
    // msalInstance["browserStorage"].clear();

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
  }

  setSkipToContent() {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { this.skipToContent = `#mainContainer`; });
  }

  handleActiveTab(title: any) {
    for (var item of this.menuItems) {
      item.navActive = false;
      if (item.title == title) {
        item.navActive = true;
      }
    }
  }

  logInPopup() {
    this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest).subscribe((response: AuthenticationResult) => {
      if (response != null && response.account != null) {
        this.msalService.instance.setActiveAccount(response.account);
        this.getClaims(this.msalService.instance.getActiveAccount()?.idTokenClaims);
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
      else if (url.includes('exchangesets')) {
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

  getMenuItems() {
    if (this.authOptions?.isSignedIn()) {
      return this.menuItems;
    } else {
      return [];
    }
  }
}