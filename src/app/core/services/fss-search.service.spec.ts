import { TestBed } from '@angular/core/testing';

import { FssSearchService } from './fss-search.service';

describe('FssSearchService', () => {
  let service: FssSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
