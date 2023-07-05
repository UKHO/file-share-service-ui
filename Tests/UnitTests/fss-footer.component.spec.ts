import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssFooterComponent } from '../../src/app/shared/components/fss-footer/fss-footer.component';
import { FooterComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';

describe('FssFooterComponent', () => {
  let component: FssFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FssFooterComponent, FooterComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        copyright: "© Crown copyright " + new Date().getUTCFullYear() + " UK Hydrographic Office"
      }
    };
  });

  test('should have footer component', () => {
    const fixture = TestBed.createComponent(FssFooterComponent);
    const footer = fixture.debugElement.nativeElement.querySelector('admiralty-footer');
    const header = fixture.debugElement.nativeElement.querySelector('admiralty-header');
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

  test('should render 2 navigation elements in admiralty-footer', () => {
    const fixture = TestBed.createComponent(FssFooterComponent);
    fixture.detectChanges();
    const footer = fixture.debugElement.queryAll(By.css('admiralty-link'));
    expect(footer.length).toEqual(2);
  });


  test('should exist data for footer navigation', () => {
    component = new FssFooterComponent();
    expect(component.privacyUrl).not.toBeNull();
    expect(component.privacyTitle).toEqual("Privacy Policy");
    expect(component.accessibilityUrl).not.toBeNull();
    expect(component.accessibilityTitle).toEqual("Accessibility");
  });
});

