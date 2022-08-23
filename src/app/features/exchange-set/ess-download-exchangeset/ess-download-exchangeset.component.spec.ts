import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssDownloadExchangesetComponent } from './ess-download-exchangeset.component';

describe('EssDownloadExchangesetComponent', () => {
  let component: EssDownloadExchangesetComponent;
  let fixture: ComponentFixture<EssDownloadExchangesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssDownloadExchangesetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
