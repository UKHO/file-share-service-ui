import { TestBed } from '@angular/core/testing';

import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';

describe('EssInfoErrorMessageService', () => {
  let service: EssInfoErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EssInfoErrorMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
