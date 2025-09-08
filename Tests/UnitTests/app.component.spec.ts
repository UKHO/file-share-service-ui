import { TestBed } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../src/app/app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { ApmService } from '@elastic/apm-rum-angular';


describe('AppComponent', () => {
  let component: AppComponent;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let titleService: Title;
  let msalService: MsalService;
  let apmservice: ApmService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MsalModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        MsalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
    msalService = TestBed.inject(MsalService);
    apmservice = TestBed.inject(ApmService)
    });

  it('should exist', () => {
    component = new AppComponent(activatedRoute, router, titleService, msalService, apmservice);
    expect(component).toBeDefined();
  })

  test('should render "Skip to Main Content" in an anchor tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const atag = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(atag.textContent).toContain('Skip to Main Content');
  });

})

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
