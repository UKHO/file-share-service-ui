import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssSimplifiedFilterComponent } from './fss-simplified-filter.component';

describe('FssSimplifiedFilterComponent', () => {
  let component: FssSimplifiedFilterComponent;
  let fixture: ComponentFixture<FssSimplifiedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssSimplifiedFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSimplifiedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
