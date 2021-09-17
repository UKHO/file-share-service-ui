import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FssPopularSearchBatchesComponent } from '../../src/app/features/fss-search/fss-popular-search-batches/fss-popular-search-batches.component';

describe('FssPopularSearchBatchesComponent', () => {
  let component: FssPopularSearchBatchesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssPopularSearchBatchesComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  });

  it('should create', () => {
    let fixture = TestBed.createComponent(FssPopularSearchBatchesComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
