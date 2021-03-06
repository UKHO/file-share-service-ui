import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MsalModule, MsalService, MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import { FssHeaderComponent } from '../../src/app/shared/components/fss-header/fss-header.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicClientApplication } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';

describe('FssHeaderComponent', () => {
  let component: FssHeaderComponent;
  let msalService: MsalService;
  let route:Router;
  let msalBroadcastServie:MsalBroadcastService;
  let fileShareApiService: FileShareApiService;
  let analyticsService: AnalyticsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MsalModule],
      declarations: [FssHeaderComponent, HeaderComponent],
       providers: [
         FileShareApiService,
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory       
        },
        {
          provide: "googleTagManagerId",
          useValue: "YOUR_GTM_ID"       
        },
         MsalService,
         AnalyticsService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    AppConfigService.settings = { 
      fssConfig:{ fssTitle: 'File Share Service'}
    };
    msalService = TestBed.inject(MsalService);
    route = TestBed.inject(Router);    
    msalBroadcastServie = TestBed.inject(MsalBroadcastService);    
    fileShareApiService = TestBed.inject(FileShareApiService);      
  });

  test('should exist msalService', () => {    
    expect(msalService).toBeDefined();
  });

  test('should have header component', () => {
    const fixture = TestBed.createComponent(FssHeaderComponent);
    const header = fixture.debugElement.nativeElement.querySelector('ukho-header');
    const footer = fixture.debugElement.nativeElement.querySelector('ukho-footer');
    expect(header).not.toBeNull();
    expect(footer).toBeFalsy();
  });

  test('should render the title element of ukho-header', () => {
    const fixture = TestBed.createComponent(FssHeaderComponent);
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('ukho-header')).nativeElement;
    expect(header.querySelector('h1').textContent).toContain(AppConfigService.settings["fssConfig"].fssTitle);
  });

  test('should exist', () => {
    component = new FssHeaderComponent(msalService, route, msalBroadcastServie, fileShareApiService,analyticsService);
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  test('should exist the title in header', () => {
    component = new FssHeaderComponent(msalService, route, msalBroadcastServie, fileShareApiService,analyticsService);
    component.ngOnInit();
    expect(component.title).toEqual(AppConfigService.settings["fssConfig"].fssTitle);
  });

  test('should exist Exchange set menu item in header', () => {
    component = new FssHeaderComponent(msalService, route, msalBroadcastServie, fileShareApiService,analyticsService);
    component.ngOnInit();
    component.authOptions =
    {
      signedInButtonText: '',
      signInHandler: (() => { }),
      signOutHandler: (() => { }),
      isSignedIn: (() => { return true }),
      userProfileHandler: (() => {})
    }
    expect(component.getMenuItems().length).toEqual(2);
    expect(component.menuItems[0].title).toEqual("Exchange sets");
  });
  test('should not exist Exchange set search, menu item in header if not logged in', () => {
    component = new FssHeaderComponent(msalService, route, msalBroadcastServie, fileShareApiService,analyticsService);
    component.ngOnInit();
    component.authOptions =
    {
      signedInButtonText: '',
      signInHandler: (() => { }),
      signOutHandler: (() => { }),
      isSignedIn: (() => { return false }),
      userProfileHandler: (() => {})
    }
    expect(component.getMenuItems().length).toEqual(0);
  });
  test('should exist Search menu item in header', () => {
    component = new FssHeaderComponent(msalService, route, msalBroadcastServie, fileShareApiService,analyticsService);
    component.ngOnInit();
    expect(component.menuItems.length).toEqual(2);
    expect(component.menuItems[1].title).toEqual("Search");
  });

});


export function MockMSALInstanceFactory () {    
 return new PublicClientApplication ( {
    auth:{
      clientId:"",
      authority: "",
      redirectUri: "/",
      knownAuthorities: [],
      postLogoutRedirectUri: "/",
      navigateToLoginRequestUrl: false
    },
    cache:{
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  })           
};


