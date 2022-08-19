import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { NO_ERRORS_SCHEMA, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule  , CheckboxModule,TextinputModule} from '@ukho/design-system';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;
  let service: EssUploadFileService;
  const router = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule, CheckboxModule,TextinputModule],
      declarations: [EssAddSingleEncsComponent],
      providers: [
        EssUploadFileService,
        {
          provide : Router,
          useValue : router
        },
      ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
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

  it('validateAndAddENC should   raise "Please enter ENC number."error',() => {
    component.txtSingleEnc = '';
    component.renderedFrom='encList';
     component.validateAndAddENC();   
     expect(component.messageType).toEqual('error');
     expect(component.messageDesc).toEqual('Please enter ENC number.');
     expect(component.displayErrorMessage).toBe(true);
   });
   
  it('validateAndAddENC should   raise "Invalid ENC number."error',() => {
    component.txtSingleEnc = 'AU22015';
    component.renderedFrom='encList';
    component.validateAndAddENC();   
    expect(component.messageType).toEqual('error');
    expect(component.messageDesc).toEqual('Invalid ENC number.');
    expect(component.displayErrorMessage).toBe(true);
  });

  it('validateAndAddENC should   raise "ENC already in list."info',() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];    
    component.txtSingleEnc = 'AU220150';    
    component.renderedFrom='encList';
    component.validateAndAddENC();   
    expect(component.messageType).toEqual('info');
    expect(component.messageDesc).toEqual('ENC already in list.');
    expect(component.displayErrorMessage).toBe(true);
   });

   it('validateAndAddENC should   raise "Max ENC limit reached."info',() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M', 'HR50017C', 'ID202908', 'JP24S8H0'];    
    component.renderedFrom='encList';
    component.txtSingleEnc = 'US4FL18M';    
    component.validateAndAddENC();   
    expect(component.messageType).toEqual('info');
    expect(component.messageDesc).toEqual('Max ENC limit reached.');
    expect(component.displayErrorMessage).toBe(true);
   });

   it('validateAndAddENC should set sigle valid ENC',() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];    
    component.txtSingleEnc = 'US4FL18M';   
    component.renderedFrom='encList'; 
    service.setValidENCs(component.validEnc);
    component.validateAndAddENC();      
    expect(component.displayErrorMessage).toBe(false);
   });
});
