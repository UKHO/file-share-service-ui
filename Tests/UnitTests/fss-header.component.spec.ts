import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssHeaderComponent } from '../../src/app/shared/components/fss-header/fss-header.component';
import { HeaderComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { constants } from '../../appConfig';

describe('FssHeaderComponent', () => {
  let component: FssHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FssHeaderComponent, HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
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
    expect(header.querySelector('h2').textContent).toContain(constants.fssTitle);
  });

  test('should exist', () => {
    component = new FssHeaderComponent();
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  test('should exist the branding title in header', () => {
    component = new FssHeaderComponent();
    component.ngOnInit();
    expect(component.branding.title).toEqual(constants.fssTitle);
  });

  test('should exist 2 menu items in header', () => {
    component = new FssHeaderComponent();
    component.ngOnInit();
    expect(component.menuItems.length).toEqual(2);
    expect(component.menuItems[0].title).toEqual("Search");
    expect(component.menuItems[1].title).toEqual("Sign in");
  });
});




