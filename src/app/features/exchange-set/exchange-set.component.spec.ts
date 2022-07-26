import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeSetComponent } from './exchange-set.component';

describe('ExchangeSetComponent', () => {
  let component: ExchangeSetComponent;
  let fixture: ComponentFixture<ExchangeSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
