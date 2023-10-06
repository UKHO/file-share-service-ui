import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssPhaseBannerComponent } from '../../src/app/shared/components/fss-phase-banner/fss-phase-banner.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { AdmiraltyPhaseBanner } from '@ukho/admiralty-angular';

describe('FssPhaseBannerComponent', () => {
  let component: FssPhaseBannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FssPhaseBannerComponent, AdmiraltyPhaseBanner],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        phase: 'beta',
        feedbackEmailId: 'products.feedback.dev@UKHO.gov.uk'
      }
    };
  });

  test('should have banner component', () => {
    const fixture = TestBed.createComponent(FssPhaseBannerComponent);
    const banner = fixture.debugElement.nativeElement.querySelector('admiralty-phase-banner');
    const header = fixture.debugElement.nativeElement.querySelector('admiralty-header');
    expect(banner).not.toBeNull();
    expect(header).toBeFalsy();
  });


  test('beta should exist in phase for banner', () => {
    component = new FssPhaseBannerComponent();
    expect(component.phase).toEqual('beta');
  });

  test('mailto link should exist in link for banner', () => {
    component = new FssPhaseBannerComponent();
    expect(component.link).toContain('mailto:');
  });

  test('feedback should exist in link for banner', () => {
    component = new FssPhaseBannerComponent();
    expect(component.link).toContain('feedback');
  });
});
