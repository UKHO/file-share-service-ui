import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssSearchResultsComponent } from './fss-search-results.component';

describe('FssSearchResultsComponent', () => {
  let component: FssSearchResultsComponent;
  let fixture: ComponentFixture<FssSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
