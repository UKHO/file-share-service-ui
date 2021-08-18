import { TestBed } from '@angular/core/testing';

import { FssSearchHelperService } from '../../src/app/core/services/fss-search-helper.service';

describe('FssSearchHelperService', () => {
  let service: FssSearchHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssSearchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
