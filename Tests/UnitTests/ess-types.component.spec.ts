import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssTypesComponent } from '../../src/app/features/exchange-set/ess-types/ess-types.component';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { CommonModule } from '@angular/common';

describe('EssTypesComponent', () => {
  let component: EssTypesComponent;
  let fixture: ComponentFixture<EssTypesComponent>;
  let service: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  const router = {
    navigate: jest.fn()
  };
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,CommonModule],
      declarations: [EssTypesComponent, EssInfoErrorMessageComponent],
      providers: [EssUploadFileService, EssInfoErrorMessageService,{
        provide: Router,
        useValue: router
      },
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
});
    beforeEach(() => {
      AppConfigService.settings = {
        essConfig: {
          MaxEncLimit: 10,
          aioExcludeEncs :["GB800001","FR800001"]
        }
      };
  
      fixture = TestBed.createComponent(EssTypesComponent);
      service = TestBed.inject(EssUploadFileService);
      essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Delta Download" selected by default', () => {
    expect(component.selectedOption).toEqual('delta');
  });

  it('should update selected option on option change', () => {
    component.onOptionChange('base');
    expect(component.selectedOption).toEqual('base');
  });

  it('should navigate to "exchangesets/exchange-set" on proceed button click when both radio button and date are selected', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    component.onOptionChange('base');
    const event: any = { target: { valueAsDate: new Date() } };
    component.onDateChange(event);
    component.onProceedClicked();
    expect(routerSpy).toHaveBeenCalledWith(['exchangesets', 'exchange-set']);
  });

  it('should navigate to "exchangesets/exchange-set" on Proceed button click when Base option is selected', () => {
    component.onOptionChange('base');
    component.onProceedClicked();
    expect(router.navigate).toHaveBeenCalledWith(['exchangesets', 'exchange-set']);
  });

  it('should navigate to next page when delta download option is selected and date is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 10); 
    component.selectedOption = 'delta'; 
    component.isDateValid = true; 
    component.isDateSelected = true;
    component.onDateChange({ target: { valueAsDate: validDate } } as any); 

    component.onProceedClicked(); 

    expect(navigateSpy).toHaveBeenCalledWith(['exchangesets', 'exchange-set']);
  });

  it('should show error message when delta option is selected but date is in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); 

    component.selectedOption = 'delta'; 
    component.isDateSelected = true; 
    component.onDateChange({ target: { valueAsDate: futureDate } } as any); 

    const errorMessage = 'Please choose a date from today or up to 27 days in the past. Future dates are not permitted.';
    const errObj={
      showInfoErrorMessage: true,
      messageType: 'info',
      messageDesc: errorMessage}
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });
  it('should show error message when delta option is selected but date is greater than 27 days in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 28); 

    component.selectedOption = 'delta'; 
    component.isDateSelected = true; 
    component.onDateChange({ target: { valueAsDate: pastDate } } as any); 

    const errorMessage = "Please select Base Download for duration greater than 27 days from today's date.";
    const errObj = {
      showInfoErrorMessage: true,
      messageType: 'info',
      messageDesc: errorMessage
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
});

});
