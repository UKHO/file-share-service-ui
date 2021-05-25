import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssPhaseBannerComponent } from './fss-phase-banner.component';

describe('FssPhaseBannerComponent', () => {
  let component: FssPhaseBannerComponent;
  let fixture: ComponentFixture<FssPhaseBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssPhaseBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssPhaseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
