import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FssSearchComponent } from '../../src/app/features/fss-search/fss-search.component';
import {jest} from '@jest/globals';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('FssSearchComponent', () => {
  let component: FssSearchComponent;
  let fixture: ComponentFixture<FssSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [],
      declarations: [ FssSearchComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create FssSearchComponent', () => {
    const fixture = TestBed.createComponent(FssSearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});