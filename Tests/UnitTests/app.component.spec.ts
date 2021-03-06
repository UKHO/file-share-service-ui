import { TestBed } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../src/app/app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';


describe('AppComponent', () => {
  let component: AppComponent;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let titleService: Title

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router); 
    });

  it('should exist', () => {
    component = new AppComponent(activatedRoute, router, titleService);
    expect(component).toBeDefined();
  })

  test('should render "Skip to Main Content" in an anchor tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const atag = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(atag.textContent).toContain('Skip to Main Content');
  });

})
