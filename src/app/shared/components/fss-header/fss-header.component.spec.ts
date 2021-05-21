import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssHeaderComponent } from './fss-header.component';

describe('FssHeaderComponent', () => {
  let component: FssHeaderComponent;
  let fixture: ComponentFixture<FssHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
