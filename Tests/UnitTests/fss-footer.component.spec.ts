import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssFooterComponent } from '../../src/app/shared/components/fss-footer/fss-footer.component';
import { FooterComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fssConfiguration } from '../../appConfig';

describe('FssFooterComponent', () => {
  let component: FssFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FssFooterComponent, FooterComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should have footer component', () => {
    const fixture = TestBed.createComponent(FssFooterComponent);
    const footer = fixture.debugElement.nativeElement.querySelector('ukho-footer');
    const header = fixture.debugElement.nativeElement.querySelector('ukho-header');
    expect(footer).not.toBeNull();
    expect(header).toBeFalsy();
  });

  test('should render image and navigation in ukho-footer', () => {
    const fixture = TestBed.createComponent(FssFooterComponent);
    fixture.detectChanges();
    const footerAnchorTags = fixture.debugElement.queryAll(By.css('a'));
    for (var i = 0; i < footerAnchorTags.length; i++) {
      var img = footerAnchorTags[i];
      expect(img.attributes['href']).not.toBe(null);
    }
  });

  test('should render the text element of ukho-footer', () => {
    const fixture = TestBed.createComponent(FssFooterComponent);
    fixture.detectChanges();
    const footer = fixture.debugElement.query(By.css('ukho-footer')).nativeElement;
    expect(footer.querySelector('p').textContent).not.toBeNull();
    expect(footer.querySelector('p').textContent).toContain(fssConfiguration.copyright);
    expect(footer.querySelector('p').textContent).not.toContain('File Share Service');
  });

  test('should exist', () => {
    component = new FssFooterComponent();
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  test('should exist copyright statement in footer', () => {
    component = new FssFooterComponent();
    component.ngOnInit();
    expect(component.text).toEqual(fssConfiguration.copyright);
    expect(component.text).not.toEqual('File Share Service');
  });

  test('should exist 2 menu items in footer', () => {
    component = new FssFooterComponent();
    component.ngOnInit();
    expect(component.navigation.length).toEqual(2);
    expect(component.navigation[0].title).toEqual("Privacy policy");
    expect(component.navigation[1].title).toEqual("Accessibility");
  });
});


