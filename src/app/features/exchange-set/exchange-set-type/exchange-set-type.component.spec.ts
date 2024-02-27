import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeSetTypeComponent } from './exchange-set-type.component';

describe('ExchangeSetTypeComponent', () => {
  let component: ExchangeSetTypeComponent;
  let fixture: ComponentFixture<ExchangeSetTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeSetTypeComponent]
    });
    fixture = TestBed.createComponent(ExchangeSetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
