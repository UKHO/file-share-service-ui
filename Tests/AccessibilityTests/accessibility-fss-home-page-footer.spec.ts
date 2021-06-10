import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssFooterComponent } from '../../src/app/shared/components/fss-footer/fss-footer.component';
import { FooterComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {axe} from 'jest-axe'

 describe('Accessibility Tests FssFooterComponent', () => {
  let component: FssFooterComponent;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [FssFooterComponent , FooterComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();     
      
    });

    test('should retuns no violations for ukho-footer component', async() =>{
        const fixture = TestBed.createComponent(FssFooterComponent);
        fixture.detectChanges();     
        const footer = fixture.debugElement.query(By.css('ukho-footer'));
        const results= await axe(footer.nativeElement);
        expect(results.violations).toEqual([]);
      });

      test('should retuns no violation for image in ukho-footer component', async() =>{
        const fixture = TestBed.createComponent(FssFooterComponent);
        fixture.detectChanges();     
        const footer = fixture.debugElement.query(By.css('ukho-footer')).childNodes;
        const imglink=footer[0].nativeNode.querySelector('img');        
        const results= await axe(imglink);
        expect(results.violations).toEqual([]);      
      });

      test('should retuns no violations for Privacy policy anchor tag in ukho-footer', async() =>{
        const fixture = TestBed.createComponent(FssFooterComponent);
        fixture.detectChanges();     
        const footer = fixture.debugElement.query(By.css('ukho-footer')).childNodes;        
        const link= footer[1].nativeNode.querySelector('a');
        expect(link.textContent).toEqual("Privacy policy");
        const results= await axe(link);
        expect(results.violations).toEqual([]);
      });

      test('should retuns no violations for Accessibility anchor tag in ukho-footer', async() =>{
        const fixture = TestBed.createComponent(FssFooterComponent);
        fixture.detectChanges();     
        const footer = fixture.debugElement.query(By.css('ukho-footer')).childNodes;
        const link= footer[1].nativeNode.querySelector('a:nth-child(2)');
        expect(link.textContent).toEqual("Accessibility");
        const results = await axe(link);
        expect(results.violations).toEqual([]);   
      });

      test('should retuns pass as true for all anchor tag href attribute present in ukho-footer', async() =>{
        const fixture = TestBed.createComponent(FssFooterComponent);
        fixture.detectChanges();     
        const footeranchortags = fixture.debugElement.queryAll(By.css('a'));
        for (var i = 0; i < footeranchortags.length; i++) {
            var anchortags = footeranchortags[i];
            expect(anchortags.attributes['href']).not.toBe(null);            
        }           
      });      
      
      test('should returns violations for mock html', async() =>{
        const failingExtendedHtmlExample = `
                                    <html>
                                        <body>
                                           <a href="#"></a>
                                           <img src="#"/>
                                        </body>
                                    </html>`
        const render = () => failingExtendedHtmlExample
        const html = render()                            
        const results = await axe(html)
        expect(results.violations.length).toBeGreaterThan(0)      
      });

});