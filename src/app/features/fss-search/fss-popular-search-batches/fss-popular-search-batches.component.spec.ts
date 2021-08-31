import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssPopularSearchBatchesComponent } from './fss-popular-search-batches.component';

describe('FssPopularSearchBatchesComponent', () => {
  let component: FssPopularSearchBatchesComponent;
  let fixture: ComponentFixture<FssPopularSearchBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssPopularSearchBatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssPopularSearchBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
