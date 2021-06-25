import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssSearchRowComponent } from './fss-search-row.component';

describe('FssSearchRowComponent', () => {
  let component: FssSearchRowComponent;
  let fixture: ComponentFixture<FssSearchRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssSearchRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSearchRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
