import { TestBed } from '@angular/core/testing';

import { EssInfoErrorMessageService, InfoErrorMessage } from '../../src/app/core/services/ess-info-error-message.service';

describe('EssInfoErrorMessageService', () => {
  let service: EssInfoErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EssInfoErrorMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('infoErrorMessage should not be null' , () =>{
    expect(service.infoErrMessage).not.toBeNull();
  });

  it('showInfoMessageSubject should not be null' , () => {
    expect(service.showInfoMessageBSubject).not.toBeNull();
  });

  it('showInfoErrorMessage should emit messages from showInfoMessageBSubject' , () => {
    const errObj: InfoErrorMessage = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Error Test Message'
    };
    service.showInfoErrorMessage = errObj;
    service.showInfoMessageBSubject.subscribe((errMsg) => {
      expect(errMsg).toStrictEqual(errObj);
    });
  });

});
