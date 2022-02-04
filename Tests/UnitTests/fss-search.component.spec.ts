import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FssSearchComponent } from '../../src/app/features/fss-search/fss-search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';

describe('FssSearchComponent', () => {
  let component: FssSearchComponent;
  let fixture: ComponentFixture<FssSearchComponent>;
  let msalService: MsalService;
  let analyticsService:AnalyticsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ FssSearchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        {
          provide: "googleTagManagerId",
          useValue: "YOUR_GTM_ID"
        },
        MsalService,
        AnalyticsService
      ]
    })
    .compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://dummyfssapiurl ",
         displaySimplifiedSearchLink: true
      }};
    msalService = TestBed.inject(MsalService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create FssSearchComponent', () => {
    const fixture = TestBed.createComponent(FssSearchComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
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