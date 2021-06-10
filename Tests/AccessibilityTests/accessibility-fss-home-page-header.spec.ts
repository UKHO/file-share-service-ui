import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssHeaderComponent } from '../../src/app/shared/components/fss-header/fss-header.component';
import { HeaderComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {axe} from 'jest-axe'

describe('Accessibility Test FssHeaderComponent', () => {
    let component: FssHeaderComponent;
    
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [RouterTestingModule],
          declarations: [FssHeaderComponent , HeaderComponent],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      });

      test('should return no violation for "Skip to content" in an anchor tag', async() =>{
        const fixture = TestBed.createComponent(FssHeaderComponent);
        fixture.detectChanges();   
        const anchortag = fixture.debugElement.query(By.css('a')).nativeElement;  
        expect(anchortag.textContent).toContain('Skip to content');
        const results= await axe(anchortag)
        expect(results.violations).toEqual([])
        });

        test('should return pass as true for href attribute present in an anchor tag', async() =>{
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

        test('should returns no violation for branding logo under ukho-header component ', async() =>{
                const fixture = TestBed.createComponent(FssHeaderComponent);
                fixture.detectChanges();   
                const headernodes =fixture.debugElement.query(By.css('ukho-header')).childNodes;            
                const imglink=headernodes[0].nativeNode.querySelector('a');        
                const results= await axe(imglink);
                expect(results.violations).toEqual([]);      
        });

        test('should returns no violation for image logo under ukho-header component ', async() =>{
          const fixture = TestBed.createComponent(FssHeaderComponent);
          fixture.detectChanges();   
          const headernodes =fixture.debugElement.query(By.css('ukho-header')).childNodes;            
          const imglink=headernodes[0].nativeNode.querySelector('img');        
          const results= await axe(imglink);
          expect(results.violations).toEqual([]);      
        });


        test('should return pass as false for no href attribute search link under ukho-header component ', async() =>{
            const fixture = TestBed.createComponent(FssHeaderComponent);
            fixture.detectChanges();   
            const allanchorrnodes =fixture.debugElement.queryAll(By.css('a')); 
            const linksearch=allanchorrnodes[2];      
            expect(linksearch.nativeElement.textContent).toEqual('Search');         
            expect(linksearch.attributes['href']).toBeFalsy();   
        });

        test('should return pass as false for no href attribute Sign In link under ukho-header component ', async() =>{
          const fixture = TestBed.createComponent(FssHeaderComponent);
          fixture.detectChanges();   
          const allanchorrnodes =fixture.debugElement.queryAll(By.css('a')); 
          const linksearch=allanchorrnodes[3];      
          expect(linksearch.nativeElement.textContent).toEqual('Sign in');         
          expect(linksearch.attributes['href']).toBeFalsy();   
      });

      test('should returns no violation for header under ukho-header component ', async() =>{
        const fixture = TestBed.createComponent(FssHeaderComponent);
        fixture.detectChanges();   
        const headernode =fixture.debugElement.query(By.css('h2')).nativeElement; 
        const results= await axe(headernode);
        expect(results.violations).toEqual([]);   
        
        expect(headernode.textContent).not.toBe(null);         
         
    });


    });