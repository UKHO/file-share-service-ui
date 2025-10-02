import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MsalModule,
  MsalService,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration
} from '@azure/msal-angular';
import { FssHeaderComponent } from '../../src/app/shared/components/fss-header/fss-header.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';
import { SignInClicked } from '../../src/app/core/services/signInClick.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';

describe('FssHeaderComponent', () => {
  let component: FssHeaderComponent;
  //let msalGuardConfiguration: MsalGuardConfiguration;
  let msalService: MsalService;
  let route: Router;
  let msalBroadcastServie: MsalBroadcastService;
  //let analyticsService: AnalyticsService;
  let signInButtonService: SignInClicked;
  let essUploadFileService: EssUploadFileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MsalModule],
      declarations: [FssHeaderComponent],
      providers: [
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MockMSALGuardConfigFactory,
        },
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
      fssConfig: { fssTitle: 'File Share Service' },
      essConfig: {}
    };
    //msalGuardConfiguration;
    msalService = TestBed.inject(MsalService);
    route = TestBed.inject(Router);
    msalBroadcastServie = TestBed.inject(MsalBroadcastService);
    signInButtonService = TestBed.inject(SignInClicked);
    essUploadFileService = TestBed.inject(EssUploadFileService);
  });

  //Rhz new
  function create() {
    const fixture = TestBed.createComponent(FssHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture };
  }
  //Rhz end

  test('should exist msalService', () => {
    expect(msalService).toBeDefined();
  });

  test('should exist signInButtonService', () => {
    expect(signInButtonService).toBeDefined();
  });

  test('should have header component', () => {
    //const fixture = TestBed.createComponent(FssHeaderComponent);
    const { fixture } = create();
    const header = fixture.debugElement.nativeElement.querySelector('admiralty-header');
    const footer = fixture.debugElement.nativeElement.querySelector('admiralty-footer');
    expect(header).not.toBeNull();
    expect(footer).toBeFalsy();
  });


  test('should exist', () => {
    //component = new FssHeaderComponent(msalGuardConfiguration, msalService, route, msalBroadcastServie, analyticsService, signInButtonService,essUploadFileService);
    create();
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  test('should exist the title in header', () => {
    //component = new FssHeaderComponent(msalGuardConfiguration, msalService, route, msalBroadcastServie, analyticsService, signInButtonService,essUploadFileService);
    create();
    component.ngOnInit();
    expect(component.title).toEqual(AppConfigService.settings["fssConfig"].fssTitle);
  });

  test('should exist Exchange set menu item in header', () => {
    //component = new FssHeaderComponent(msalGuardConfiguration, msalService, route, msalBroadcastServie, analyticsService, signInButtonService,essUploadFileService);
    create();
    component.ngOnInit();
    

    expect(component.essTitle).toEqual("Exchange sets");
  });
  test('should not exist Exchange set search, menu item in header if not logged in', () => {
    //component = new FssHeaderComponent(msalGuardConfiguration, msalService, route, msalBroadcastServie, analyticsService, signInButtonService,essUploadFileService);

    create();
    component.ngOnInit();
    
  });
  test('should exist Search menu item in header', () => {
    //component = new FssHeaderComponent(msalGuardConfiguration, msalService, route, msalBroadcastServie, analyticsService, signInButtonService,essUploadFileService);
    create();
    component.ngOnInit();

    expect(component.searchTitle).toEqual("Search");
  });

  test('should set isPrivilegedUser to true for admin domains', () => {
    //component = new FssHeaderComponent(msalGuardConfiguration, msalService, route, msalBroadcastServie, analyticsService, signInButtonService,essUploadFileService);
    create();
    component.configPrivilegedUserDomains = ["test.com", "abcd.com"];
    const claims = {
      email: "admin@test.com"
    };
    component.getClaims(claims);
    expect(essUploadFileService.isPrivilegedUser).toEqual(true);
  })

});


export function MockMSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: "",
      authority: "",
      redirectUri: "/",
      knownAuthorities: [],
      postLogoutRedirectUri: "/",
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  })
};

export function MockMSALGuardConfigFactory() {
  return {
    interactionType: InteractionType.None,
    authRequest: {
      scopes: [],
    },
  };
};
