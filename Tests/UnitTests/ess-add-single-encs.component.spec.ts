import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validateAndProcessENC should display error when ENC field is blank', () => {
    component.txtSingleEnc = '';
    component.validateAndProcessENC();
    expect(component.messageType).toEqual('error');
    expect(component.messageDesc).toEqual('Please enter ENC number');
    expect(component.displayErrorMessage).toBe(true);
  });

  it('validateAndProcessENC should display error when ENC number is invalid', () => {
    component.txtSingleEnc = 'AS1212121';
    component.validateAndProcessENC();
    expect(component.messageType).toEqual('error');
    expect(component.messageDesc).toEqual('Invalid ENC number');
    expect(component.displayErrorMessage).toBe(true);
  });

  it('validateAndProcessENC should set validENC number', () => {
    component.txtSingleEnc = 'AS121212';
    component.validateAndProcessENC();    
    expect(component.displayErrorMessage).toBe(false);
  });
});
