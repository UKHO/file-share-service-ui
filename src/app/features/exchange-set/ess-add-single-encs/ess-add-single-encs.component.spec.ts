import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssAddSingleEncsComponent } from './ess-add-single-encs.component';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssAddSingleEncsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssAddSingleEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
