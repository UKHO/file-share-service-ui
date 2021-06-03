import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment.service';
import { FssConfiguration } from './fss-configuration.types';
import { FssEnvironment } from './fss-environment.type';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  let fssEnv: FssEnvironment = new FssEnvironment();
  fssEnv.fssConfiguration = new FssConfiguration();

  fssEnv.fssConfiguration.feedbackEmailId = 'products.feedback.test@UKHO.gov.uk';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FssEnvironment, useValue: fssEnv }
      ]
    });
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getFssConfiguration should return FeedabckEmailID', () => {
    expect(service.getFssConfiguration().feedbackEmailId).toEqual('products.feedback.test@UKHO.gov.uk');
  });
});
