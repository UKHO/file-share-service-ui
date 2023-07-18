import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssListEncsComponent } from '../../src/app/features/exchange-set/ess-list-encs/ess-list-encs.component';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule  , CheckboxModule,TextinputModule} from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { CommonModule } from '@angular/common';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ExchangeSetApiService } from '../../src/app/core/services/exchange-set-api.service';
import { By } from '@angular/platform-browser';
import { MockMSALInstanceFactory } from './fss-advanced-search.component.spec';
import { HttpClientModule } from '@angular/common/http';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { DesignSystemModule } from '@ukho/admiralty-angular';

describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let msalService: MsalService;
  let exchangeSetApiService: ExchangeSetApiService;
  let fixture: ComponentFixture<EssListEncsComponent>;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  const router = {
    navigate: jest.fn()
  };
  const service = {
    getValidEncs: jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs: jest.fn(),
    getSelectedENCs: jest.fn().mockReturnValue([]),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
    getNotifySingleEnc : jest.fn().mockReturnValue(of(true)),
    exchangeSetCreationResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData)),
    addAllSelectedEncs : jest.fn(),
    getEstimatedTotalSize:jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule,
                CardModule, TableModule, CheckboxModule, TextinputModule, HttpClientModule, DesignSystemModule],
      declarations: [EssListEncsComponent,
        EssAddSingleEncsComponent,
        EssInfoErrorMessageComponent,
      ],
      providers: [
        {
          provide: EssUploadFileService,
          useValue: service
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide : MsalService,
          useValue : service
        },
        {
          provide : ExchangeSetApiService,
          useValue : service
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        MsalService, ExchangeSetApiService,EssInfoErrorMessageService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      fssConfig: {
        apiScope: "test"
      },
      essConfig: {
        MaxEncLimit: 100,
        MaxEncSelectionLimit: 5
      },
    };
    window.scrollTo = jest.fn();
    msalService = TestBed.inject(MsalService);
    exchangeSetApiService = TestBed.inject(ExchangeSetApiService);
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    fixture = TestBed.createComponent(EssListEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set info message if displayErrorMessage is set to true on ngOnInit', () => {
    component.ngOnInit();
    expect(component.encList.length).toEqual(5);
  });
  it('handleChange should call service.removeSelectedEncs if enc is already present', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange('AU210130');
    expect(service.removeSelectedEncs).toHaveBeenCalled();
  });
  it('handleChange should call service.addSelectedEnc if enc is not present', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange('AU210180');
    expect(service.addSelectedEnc).toHaveBeenCalled();
  });
  it('handleChange should not call service.addSelectedEnc if selected enc"s are greater than MaxEncSelectionLimit', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130', 'AU220830']);
    component.handleChange('AU210470');
    expect(service.addSelectedEnc).not.toHaveBeenCalled();
  });
  it('syncEncsBetweenTables should set encList and selectedEncList', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.syncEncsBetweenTables();
    expect(component.selectedEncList.length).toBe(3);
    expect(component.encList.length).toBe(5);
    service.getSelectedENCs.mockReturnValue(['AU210130']);
    component.syncEncsBetweenTables();
    expect(component.selectedEncList.length).toBe(1);
    expect(component.encList.length).toBe(5);
  });

  test('should show the error message when user select encs more than selection limit', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130' , 'AU220830']);
    component.handleChange('AU210470');
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'No more than 5 ENCs can be selected.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('should create EssListEncsComponent', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should render text inside an h1 tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Exchange sets');
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      `Select up to 5 ENCs and make an exchange set`
    );
  });

  test('getValidEncs should return enc', () => {
    const encList = service.getValidEncs();
    expect(encList.length).toEqual(5);
  });

  it('should display Select All text when enc list is less than or equal to configurable enc limit', () => {
    component.ngOnInit();
    expect(component.encList.length).toBeLessThanOrEqual(5);
    expect(component.selectDeselectText).toEqual('Select all');
  });

  test('showListEncTOtal class applied to a selector', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('showListEncTOtal'))).toBeTruthy();
  });
  test('bottomText class applied to a tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('bottomText'))).toBeTruthy();
  });

  it.each`
  estimatedSize              | expectedResult
  ${'0MB'}                       |  ${'0MB'}
  ${'2.6MB'}                     |  ${'2.6MB'}
  `('getEstimatedTotalSize called from syncEncsBetweenTables and should return string',
  ({  estimatedSize, expectedResult }: {  estimatedSize: string; expectedResult: string }) => {
    jest.clearAllMocks();
    service.getEstimatedTotalSize.mockReturnValue(estimatedSize);
    component.syncEncsBetweenTables();
    expect(service.getEstimatedTotalSize).toHaveBeenCalled();
    expect(component.getEstimatedTotalSize()).toBe(expectedResult);
    expect(component.estimatedTotalSize).not.toBeNull();
    expect(component.estimatedTotalSize).toBe(expectedResult);
  });

  test('should return exchangeSet details data', () => {
    component.ngOnInit();
    let selectedEncList = ["AU210130","AU220130","AU314128","AU412129","AU415128","AU424150","AU426113","AU432115","AU439146","AU5BTB01","AU5DAM02","AU5MEL01","AU5PTL01","AU5SYD01","AU6BTB01","BR221070","BR321200","BR401507","BR441012"];
    service.exchangeSetCreationResponse(selectedEncList).subscribe((res: any) => {
      expect(res).toEqual(exchangeSetDetailsMockData);
    });
  });

    it('should display Deselect All button when select all button is clicked' ,() => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.selectDeselectAll();
    expect(component.selectDeselectText).toEqual('Deselect all');
  });

  it('should display Select All button when Deselect all button is clicked', () => {
    service.getSelectedENCs.mockReturnValue([]);
    component.selectDeselectAll();
    expect(component.selectDeselectText).toEqual('Select all');
  });

  it('should hide select all button if enc list greater than max enc limit', () => {
    service.getValidEncs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128', 'AU314140']);
    component.ngOnInit();
    expect(component.showSelectDeselect).toBeFalsy();
  });

  it('should show select all button if enc list less than or equal to max enc limit', () => {
    service.getValidEncs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.ngOnInit();
    expect(component.showSelectDeselect).toBeTruthy();
  });

  it('handleChange should set correct error message and call scrollTo is called when maxEncSelectionLimit limit is exceeded', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128', 'CU314128']);
    component.handleChange('DU314128');
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'No more than 5 ENCs can be selected.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('selectDeselectAll should call "service.addAllSelectedEncs" if selectDeselectText=Select all enc length is greater than maxEncSelectionLimit', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128', 'CU314128']);
    component.selectDeselectText = 'Select all';
    component.selectDeselectAll();
    expect(service.addAllSelectedEncs).toHaveBeenCalled();
  });

  it('selectDeselectAll should call "service.clearSelectedEncs" if selectDeselectText=Deselect all', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.selectDeselectText = 'deselect all';
    component.selectDeselectAll();
    expect(service.clearSelectedEncs).toHaveBeenCalled();
  });

  it('getSelectDeselectText should return correct texts(Select all / Deselect all)', () => {
    component.checkMaxEncSelectionAndSelectedEncLength = jest.fn().mockReturnValue(true);
    expect(component.getSelectDeselectText()).toEqual('Deselect all');
    component.checkMaxEncSelectionAndSelectedEncLength = jest.fn().mockReturnValue(false);
    expect(component.getSelectDeselectText()).toEqual('Select all');
  });

  it('should return exchangeSetResponse on exchangeSetCreationResponse', () => {
    let selectedEncList = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.exchangeSetCreationResponse([selectedEncList]);
    exchangeSetApiService.exchangeSetCreationResponse(selectedEncList).subscribe((res: any) => {
      expect(res).toEqual(exchangeSetDetailsMockData);
    });
  });

  it('exchangeSetCreationResponse should set ExchangeSetDetails', () => {
    let selectedEncList = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.exchangeSetCreationResponse([selectedEncList]);
    exchangeSetApiService.exchangeSetCreationResponse(selectedEncList).subscribe((res: any) => {
     // expect(component.displayErrorMessage).toBe(false);
     const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });
  });

  it('exchangeSetCreationResponse should set Error message on error', () => {
    let selectedEncList = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.exchangeSetCreationResponse([selectedEncList]);
    exchangeSetApiService.exchangeSetCreationResponse(selectedEncList).subscribe(() => {} , (error: any) => {
     const errObj = {
      showInfoErrorMessage : false,
      messageType : 'error',
      messageDesc : 'There has been an error'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });
  });
});

export const exchangeSetDetailsMockData: any = {
  "_links": {
    "exchangeSetBatchStatusUri": {
      "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/3e947b33-2ce0-4b9b-b0e0-e512cdfab621/status"
    },
    "exchangeSetBatchDetailsUri": {
      "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/3e947b33-2ce0-4b9b-b0e0-e512cdfab621"
    },
    "exchangeSetFileUri": {
      "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/3e947b33-2ce0-4b9b-b0e0-e512cdfab621/files/V01X01.zip"
    }
  },
  "exchangeSetUrlExpiryDateTime": "2022-09-02T06:37:34.732Z",
  "requestedProductCount": 19,
  "exchangeSetCellCount": 4,
  "requestedProductsAlreadyUpToDateCount": 0,
  "requestedProductsNotInExchangeSet": [
    {
      "productName": "AU210130",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU220130",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU314128",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU412129",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU415128",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU424150",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU426113",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU432115",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU439146",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5BTB01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5DAM02",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5MEL01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5PTL01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5SYD01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU6BTB01",
      "reason": "invalidProduct"
    }
  ]
}
