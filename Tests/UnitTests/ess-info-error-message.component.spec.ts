import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';

describe('EssInfoErrorMessageComponent', () => {
  let component: EssInfoErrorMessageComponent;
  let fixture: ComponentFixture<EssInfoErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssInfoErrorMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssInfoErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
