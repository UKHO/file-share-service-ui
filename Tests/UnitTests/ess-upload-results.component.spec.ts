import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssUploadResultsComponent } from '../../src/app/features/exchange-set/ess-upload-results/ess-upload-results.component';

describe('EssUploadResultsComponent', () => {
  let component: EssUploadResultsComponent;
  let fixture: ComponentFixture<EssUploadResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssUploadResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUploadResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
