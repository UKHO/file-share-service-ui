import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MsalBroadcastService, MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { FssHeaderComponent } from '../../src/app/shared/components/fss-header/fss-header.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicClientApplication } from '@azure/msal-browser';
import { Router } from '@angular/router';
import {axe} from 'jest-axe'

describe('Accessibility Test FssHeaderComponent', () => {
  let component: FssHeaderComponent;
  let msalService: MsalService;
  let route:Router;
  let msalBroadcastServie:MsalBroadcastService;
    
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
        route = TestBed.inject(Router);    
        msalBroadcastServie = TestBed.inject(MsalBroadcastService);          
      });

      test('should return no violation for "Skip to content" in an anchor tag', async() =>{
        const fixture = TestBed.createComponent(FssHeaderComponent);
        fixture.detectChanges();   
        const anchortag = fixture.debugElement.query(By.css('a')).nativeElement;  
        expect(anchortag.textContent).toContain('Skip to content');
        const results= await axe(anchortag)
        expect(results.violations).toEqual([])
        });

        test('should return true for href attribute present in an anchor tag', async() =>{
            const fixture = TestBed.createComponent(FssHeaderComponent);
            fixture.detectChanges();   
            const anchortag = fixture.debugElement.query(By.css('a')).nativeElement;
            expect(anchortag.attributes['href']).not.toBe(null)              
        });

        test('should return no violation for ukho-header component ', async() =>{
            const fixture = TestBed.createComponent(FssHeaderComponent);
            fixture.detectChanges();   
            const header =fixture.debugElement.query(By.css('ukho-header'));            
            const results= await axe(header.nativeElement);
            expect(results.violations).toEqual([]);
            });

        test('should return no violation for branding logo under ukho-header component ', async() =>{
                const fixture = TestBed.createComponent(FssHeaderComponent);
                fixture.detectChanges();   
                const headernodes =fixture.debugElement.query(By.css('ukho-header')).childNodes;            
                const imglink=headernodes[0].nativeNode.querySelector('a');        
                const results= await axe(imglink);
                expect(results.violations).toEqual([]);      
        });

        test('should return no violation for image logo under ukho-header component ', async() =>{
          const fixture = TestBed.createComponent(FssHeaderComponent);
          fixture.detectChanges();   
          const headernodes =fixture.debugElement.query(By.css('ukho-header')).childNodes;            
          const imglink=headernodes[0].nativeNode.querySelector('img');        
          const results= await axe(imglink);
          expect(results.violations).toEqual([]);      
        });


        test('should return false for no href attribute search link under ukho-header component ', async() =>{
            const fixture = TestBed.createComponent(FssHeaderComponent);
            fixture.detectChanges();   
            const allanchorrnodes =fixture.debugElement.queryAll(By.css('a')); 
            const linksearch=allanchorrnodes[2];      
            expect(linksearch.nativeElement.textContent).toEqual('Search');         
            expect(linksearch.attributes['href']).toBeFalsy();   
        });

        test('should return false for no href attribute Sign In link under ukho-header component ', async() =>{
          const fixture = TestBed.createComponent(FssHeaderComponent);
          fixture.detectChanges();   
          const allanchorrnodes =fixture.debugElement.queryAll(By.css('a')); 
          const linksearch=allanchorrnodes[3];      
          expect(linksearch.nativeElement.textContent).toEqual('Sign In');         
          expect(linksearch.attributes['href']).toBeFalsy();   
      });

      test('should return no violation for header under ukho-header component ', async() =>{
        const fixture = TestBed.createComponent(FssHeaderComponent);
        fixture.detectChanges();   
        const headernode =fixture.debugElement.query(By.css('h2')).nativeElement; 
        const results= await axe(headernode);
        expect(results.violations).toEqual([]);   
        
        expect(headernode.textContent).not.toBe(null);         
         
    });
});


    
export function MockMSALInstanceFactory () {    
  return new PublicClientApplication ( {
     auth:{
       clientId:"",
       authority: "",
       redirectUri: "/search",
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
 