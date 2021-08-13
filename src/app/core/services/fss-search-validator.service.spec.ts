import { TestBed } from '@angular/core/testing';

import { FssSearchValidatorService } from './fss-search-validator.service';

describe('FssSearchValidatorService', () => {
  let service: FssSearchValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssSearchValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
