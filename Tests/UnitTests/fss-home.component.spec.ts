import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssHomeComponent } from '../../src/app/features/fss-home/fss-home.component';
import { CardComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

 describe('FssHomeComponent', () => {
  let component: FssHomeComponent;
  let msalservice: MsalService;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [FssHomeComponent , CardComponent],
        providers: [
          {
            provide: MSAL_INSTANCE,
            useFactory: MockMSALInstanceFactory       
          },
           MsalService],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      msalservice:TestBed.inject(MsalService);
    });


      it('should have home component', () => {    
        const fixture = TestBed.createComponent(FssHomeComponent);
        expect(fixture).toBeTruthy(); 
      });

      test('should render the element admiralty-card', () =>{
      const fixture = TestBed.createComponent(FssHomeComponent);
      fixture.detectChanges();     
      expect(fixture.nativeElement.querySelector('admiralty-card')).not.toBeNull();
    });

      test('should render different texts inside admiralty-card', () =>{
        const fixture = TestBed.createComponent(FssHomeComponent);
        fixture.detectChanges();     
        const home = fixture.debugElement.query(By.css('admiralty-card')).nativeElement;
        expect(home.querySelector('p').textContent).not.toBeNull();
        expect(home.querySelector('p').textContent).toEqual('The ADMIRALTY File Share Service allows you to search for and download files.');
        });
     
      test('should render SignIn button inside admiralty-card', () =>{
        const fixture = TestBed.createComponent(FssHomeComponent);
        fixture.detectChanges();     
        const home = fixture.debugElement.query(By.css('admiralty-card'));
        expect(home.nativeElement.querySelector('admiralty-button').textContent).toEqual('Sign in');
      });

      test('should render Create Account link inside admiralty-card', () =>{
        const fixture = TestBed.createComponent(FssHomeComponent);
        fixture.detectChanges();     
        const home = fixture.debugElement.query(By.css('admiralty-card'));
        expect(home.nativeElement.querySelector('#fss-createaccount').textContent).not.toBeNull();
        expect(home.nativeElement.querySelector('#fss-createaccount').textContent).toEqual('Create a new account');
        
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
