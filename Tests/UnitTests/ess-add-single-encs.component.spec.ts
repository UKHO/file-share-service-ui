import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;
  let service: EssUploadFileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EssAddSingleEncsComponent],
      providers: [
        EssUploadFileService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10
      }
    };

    fixture = TestBed.createComponent(EssAddSingleEncsComponent);
    service = TestBed.inject(EssUploadFileService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onFindEnc should   raise "Please enter ENC number."error',() => {
    component.singleEncVal = '';
     component.onFindEnc();   
     expect(component.messageType).toEqual('error');
     expect(component.messageDesc).toEqual('Please enter ENC number.');
     expect(component.displayErrorMessage).toBe(true);
   });
   
  it('onFindEnc should   raise "Invalid ENC number."error',() => {
   component.singleEncVal = 'AU22015';
    component.onFindEnc();   
    expect(component.messageType).toEqual('error');
    expect(component.messageDesc).toEqual('Invalid ENC number.');
    expect(component.displayErrorMessage).toBe(true);
  });

  it('onFindEnc should   raise "ENC already in list."info',() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];    
    component.singleEncVal = 'AU220150';    
    component.onFindEnc();   
    expect(component.messageType).toEqual('info');
    expect(component.messageDesc).toEqual('ENC already in list.');
    expect(component.displayErrorMessage).toBe(true);
   });

   it('onFindEnc should   raise "Max ENC limit reached."info',() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M', 'HR50017C', 'ID202908', 'JP24S8H0'];    
    component.singleEncVal = 'US4FL18M';    
    component.onFindEnc();   
    expect(component.messageType).toEqual('info');
    expect(component.messageDesc).toEqual('Max ENC limit reached.');
    expect(component.displayErrorMessage).toBe(true);
   });

   it('onFindEnc should set sigle valid ENC',() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];    
    component.singleEncVal = 'US4FL18M';    
    service.setValidENCs(component.validEnc);
    component.onFindEnc();      
    expect(component.displayErrorMessage).toBe(false);
   });
});
