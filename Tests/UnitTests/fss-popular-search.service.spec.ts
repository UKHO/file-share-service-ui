import { TestBed } from '@angular/core/testing';

import { FssPopularSearchService } from '../../src/app/core/services/fss-popular-search.service';

describe('FssPopularSearchService', () => {
  let service: FssPopularSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssPopularSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});