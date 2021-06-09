import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssPhaseBannerComponent } from '../src/app/shared/components/fss-phase-banner/fss-phase-banner.component';
import { PhaseBannerComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { constants } from '../constants';

describe('FssPhaseBannerComponent', () => {
  let component: FssPhaseBannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FssPhaseBannerComponent, PhaseBannerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should have banner component', () => {
    const fixture = TestBed.createComponent(FssPhaseBannerComponent);
    const banner = fixture.debugElement.nativeElement.querySelector('ukho-phase-banner');
    const header = fixture.debugElement.nativeElement.querySelector('ukho-header');
    expect(banner).not.toBeNull();
    expect(header).toBeFalsy();
  });

  test('should render the phase-value "alpha" in ukho-phase-banner', () => {
    const fixture = TestBed.createComponent(FssPhaseBannerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('strong').textContent).toContain(constants.phase);
  });

  test('should render the phase-value "alpha" in ukho-phase-banner', () => {
    const fixture = TestBed.createComponent(FssPhaseBannerComponent);
    fixture.detectChanges();
    const phase = fixture.nativeElement.querySelector('strong').textContent;
    expect(phase).toBeTruthy();
  });

  test('should render the feedback link of ukho-phase-banner', () => {
    const fixture = TestBed.createComponent(FssPhaseBannerComponent);
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(banner.querySelector('a').textContent).toContain('feedback');
  });

  test('should exist', () => {
    component = new FssPhaseBannerComponent();
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  test('should exist phase in banner', () => {
    component = new FssPhaseBannerComponent();
    component.ngOnInit();
    expect(component.phase).toEqual('alpha');
  });

  test('should exist mailto link in banner', () => {
    component = new FssPhaseBannerComponent();
    component.ngOnInit();
    expect(component.link).toContain('mailto:');
  });
});