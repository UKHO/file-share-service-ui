import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { FssHeaderComponent } from '../src/app/shared/components/fss-header/fss-header.component';
import { AppConfigService } from '../src/app/core/services/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicClientApplication } from '@azure/msal-browser';
import { Router } from '@angular/router';

describe('FssHeaderComponent', () => {
  let component: FssHeaderComponent;
  let msalService: MsalService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MsalModule],
      declarations: [FssHeaderComponent, HeaderComponent],
       providers: [
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory       
        },
         MsalService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    AppConfigService.settings = { 
      fssConfig:{ fssTitle: 'File Share Service'}
    };
    msalService = TestBed.inject(MsalService);       
  });

  test('should exist msalService', () => {    
    //console.log(msalService.instance); 
    expect(msalService).toBeDefined();
  });

  test('should render "Skip to content" in an anchor tag', () => {
    const fixture = TestBed.createComponent(FssHeaderComponent);
    fixture.detectChanges();
    const atag = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(atag.textContent).toContain('Skip to content');
  });

  it('should have header component', () => {
    const fixture = TestBed.createComponent(FssHeaderComponent);
    const header = fixture.debugElement.nativeElement.querySelector('ukho-header');
    const footer = fixture.debugElement.nativeElement.querySelector('ukho-footer');
    expect(header).not.toBeNull();
    expect(footer).toBeFalsy();
  });

  test('should render the branding title element of ukho-header', () => {
    const fixture = TestBed.createComponent(FssHeaderComponent);
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('ukho-header')).nativeElement;
    expect(header.querySelector('h2').textContent).toContain(AppConfigService.settings["fssConfig"].fssTitle);
  });

  test('should exist', () => {
    component = new FssHeaderComponent(msalService, router);
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  test('should exist the branding title in header', () => {
    component = new FssHeaderComponent(msalService, router);
    component.ngOnInit();
    expect(component.branding.title).toEqual(AppConfigService.settings["fssConfig"].fssTitle);
  });

  test('should exist Search menu item in header', () => {
    component = new FssHeaderComponent(msalService,router);
    component.ngOnInit();
    expect(component.menuItems.length).toEqual(1);
    expect(component.menuItems[0].title).toEqual("Search");
  });
});


export function MockMSALInstanceFactory () {    
 return new PublicClientApplication ( {
    auth:{
      clientId:"",
      authority: "",
      redirectUri: "http://localhost:4200/search",
      knownAuthorities: [],
      postLogoutRedirectUri: "http://localhost:4200/",
      navigateToLoginRequestUrl: false
    },
    cache:{
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  })           
};


