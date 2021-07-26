import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssSearchRowComponent } from '../../src/app/features/fss-search/fss-search-row/fss-search-row.component';

describe('FssSearchRowComponent', () => {
  let component: FssSearchRowComponent;
  let fixture: ComponentFixture<FssSearchRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssSearchRowComponent ],
      schemas: [NO_ERRORS_SCHEMA]
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