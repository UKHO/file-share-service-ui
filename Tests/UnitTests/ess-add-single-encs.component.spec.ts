import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { NO_ERRORS_SCHEMA, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { TableModule } from '../../src/app/shared/components/ukho-table/table.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;
  let service: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  const router = {
    navigate: jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TableModule],
      declarations: [EssAddSingleEncsComponent , EssInfoErrorMessageComponent],
      providers: [
        EssUploadFileService,
        EssInfoErrorMessageService,
        {
          provide: Router,
          useValue: router
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        aioExcludeEncs :["GB800001","FR800001"]
      }
    };

    fixture = TestBed.createComponent(EssAddSingleEncsComponent);
    service = TestBed.inject(EssUploadFileService);
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validateAndAddENC should display error when ENC field is blank', () => {
    component.txtSingleEnc = '';
    component.renderedFrom = 'essHome';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Please enter ENC number'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should display error when ENC number is invalid', () => {
    component.txtSingleEnc = 'AS1212121';
    component.renderedFrom = 'essHome';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Invalid ENC number'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should set validENC number', () => {
    component.txtSingleEnc = 'AS121212';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should   raise "Please enter ENC number."error', () => {
    component.txtSingleEnc = '';
    component.renderedFrom = 'encList';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Please enter ENC number'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should   raise "Invalid ENC number."error', () => {
    component.txtSingleEnc = 'AU22015';
    component.renderedFrom = 'encList';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Invalid ENC number.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });
  it('validateAndAddENC should   raise "Invalid AIO ENC number."error', () => {
    component.txtSingleEnc = 'GB800001';
    component.renderedFrom = 'encList';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'info',
      messageDesc : 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should   raise "ENC already in list."info', () => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];
    component.txtSingleEnc = 'AU220150';
    component.renderedFrom = 'encList';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'info',
      messageDesc : 'ENC already in list.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should   raise "Max ENC limit reached."info', () => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M', 'HR50017C', 'ID202908', 'JP24S8H0'];
    component.renderedFrom = 'encList';
    component.txtSingleEnc = 'US4FL18M';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'info',
      messageDesc : 'Max ENC limit reached.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('validateAndAddENC should set sigle valid ENC', () => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];
    component.txtSingleEnc = 'US4FL18M';
    component.renderedFrom = 'encList';
    service.setValidENCs(component.validEnc);
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });
  it('validateAndAddENC should set single valid different case ENC', () => {
    component.validEnc = ['AU220150', 'GB50184C', 'GB50702D', 'US5AK57M'];
    component.txtSingleEnc = 'uf4FL18m';
    component.renderedFrom = 'encList';
    service.setValidENCs(component.validEnc);
    component.validateAndAddENC();
    
    expect(component.addValidEncAlert).toEqual("uf4FL18m  Added to List");
  });
});
