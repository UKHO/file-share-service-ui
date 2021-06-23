import { TestBed } from '@angular/core/testing';

import { FssSearchFilterService } from './fss-search-filter.service';

describe('FssSearchFilterService', () => {
  let service: FssSearchFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssSearchFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
