import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssDownloadExchangesetComponent } from '../../src/app/features/exchange-set/ess-download-exchangeset/ess-download-exchangeset.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { MockMSALInstanceFactory } from './fss-search.component.spec';
import { ExchangeSetDetails } from '../../src/app/core/models/ess-response-types';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { DesignSystemModule } from '@ukho/admiralty-angular';
describe('EssDownloadExchangesetComponent', () => {
  let component: EssDownloadExchangesetComponent;
  let msalService: MsalService;
  let exchangeSetDetails: ExchangeSetDetails;
  let fileShareApiService: FileShareApiService;
  let fixture: ComponentFixture<EssDownloadExchangesetComponent>;
  const router = {
    navigate: jest.fn()
  };

  const service = {
    getValidEncs: jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs: jest.fn(),
    getSelectedENCs: jest.fn(),
    infoMessage: true,
    addSelectedEnc: jest.fn(),
    removeSelectedEncs: jest.fn(),
    getNotifySingleEnc: jest.fn().mockReturnValue(of(true)),
    getExchangeSetDetails: jest.fn().mockReturnValue(exchangeSetDetailsForDownloadMockData()),
    exchangeSetCreationResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData)),
    getEstimatedTotalSize: jest.fn(),
    getBatchStatus: jest.fn(),
    refreshToken: jest.fn()
  };

  const msal_service = {
    instance: {
      acquireTokenSilent: jest.fn(),
      loginPopup: jest.fn()
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, DesignSystemModule],
      declarations: [EssDownloadExchangesetComponent,EssInfoErrorMessageComponent],
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
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        {
          provide: MsalService,
          useValue: msal_service
        },
        {
          provide: FileShareApiService,
          useValue: service
        },
        MsalService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 100,
        MaxEncSelectionLimit: 5,
        avgSizeofENC: 0.3
      },
      fssConfig: {
        apiScope: 'test',
        apiUrl: 'test.com'
      }
    };
    fileShareApiService = TestBed.inject(FileShareApiService);
    msalService = TestBed.inject(MsalService);
    fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EssDownloadExchangesetComponent', () => {
    expect(component).toBeTruthy();
  });

  test('should render text inside an h1 tag', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Exchange sets');
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      `Your exchange set is available as a download via your browser`
    );
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p')[1].textContent).toContain('The zip file will be ready soon, please do not refresh or leave this browser window.');
  });

  test('should return Exchangeset cell count', () => {
    let selectedEncList = ["AU6BTB01", "BR221070", "BR321200", "BR401507"];
    service.exchangeSetCreationResponse(selectedEncList).subscribe((res: any) => {
      expect(res).toEqual(service.getExchangeSetDetails);
    });
  });

  test('should render estimated size', () => {
    var expectedResult: any = '1.2MB';
    service.getEstimatedTotalSize.mockReturnValue('1.2MB');
    component.ngOnInit();
    expect(service.getEstimatedTotalSize).toHaveBeenCalled();
    expect(component.avgEstimatedSize).toBe(expectedResult);

    var expectedResultForKB: any = '0MB';
    service.getEstimatedTotalSize.mockReturnValue('0MB');
    component.ngOnInit();
    expect(service.getEstimatedTotalSize).toHaveBeenCalled();
    expect(component.avgEstimatedSize).toBe(expectedResultForKB);
  });
  test('should return exchangeSetTotalCount', () => {
   component.ngOnInit();
    expect(service.getExchangeSetDetails).toHaveBeenCalled();
    expect(component.requestedProductCount).toBe(19);
  });
  it('should display download button when batch status is Committed', () => {
    service.getBatchStatus.mockReturnValue(of(batchStatusCommittedMockData));
    component.batchStatusAPI();
    expect(component.displayDownloadBtn).toBe(true);
    expect(component.displayEssLoader).toBe(false);
  });

  it('should hide download button when batch status is CommitInProgress', () => {
    service.getBatchStatus.mockReturnValue(of(batchStatusCommitInProgressMockData));
    component.batchStatusAPI();
    expect(component.displayDownloadBtn).toBe(false);
    expect(component.displayEssLoader).toBe(true);
  });

  it('should show error message when batch status is Failed', () => {
    service.getBatchStatus.mockReturnValue(of(batchStatusFailedMockData));
    component.batchStatusAPI();
    expect(component.displayDownloadBtn).toBe(false);
    expect(component.displayEssLoader).toBe(false);
  });

  it('should display loader when download button is clicked and hide loader after refreshToken API response', () => {
    service.refreshToken.mockReturnValue(of());
    msal_service.instance.acquireTokenSilent.mockReturnValue(of());
    component.download();
    expect(component.displayLoader).toBe(true);
    expect(component.baseUrl).toBeDefined();
    expect(component.downloadPath).toBeDefined();
    msal_service.instance.acquireTokenSilent(component.fssSilentTokenRequest).subscribe((response: any) => {
      service.refreshToken().subscribe((res: any) => {
        expect(component.displayLoader).toBe(false);
      });
    });
  });

  it('should call loginPopup() when error in acquireTokenSilent in checkBatchStatus', () => {
    msal_service.instance.acquireTokenSilent.mockReturnValue(throwError(Error('Error')));
    component.checkBatchStatus();
    msal_service.instance.acquireTokenSilent(component.fssSilentTokenRequest).subscribe((res: any) => {
      expect(msal_service.instance.loginPopup).toHaveBeenCalled();
    });
  });

  it('should call batchStatusAPI() when no error in acquireTokenSilent in checkBatchStatus', () => {
    msal_service.instance.acquireTokenSilent.mockReturnValue(of());
    component.checkBatchStatus();
    msal_service.instance.acquireTokenSilent(component.fssSilentTokenRequest).subscribe((res: any) => {
      expect(component.batchStatusAPI).toHaveBeenCalled();
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

export function exchangeSetDetailsForDownloadMockData() {
  return {

    "_links": {
      "exchangeSetBatchDetailsUri": {
        href: "https://uatadmiralty.azure-api.net/fss-qa/batch/91138910-9764-43d7-b6e2-44b90ea64271"
      },
      "exchangeSetBatchStatusUri": {
        href: "https://uatadmiralty.azure-api.net/fss-qa/batch/91138910-9764-43d7-b6e2-44b90ea64271/status"
      },
      "exchangeSetFileUri": {
        href: "https://uatadmiralty.azure-api.net/fss-qa/batch/91138910-9764-43d7-b6e2-44b90ea64271/files/V01X01.zip"
      }
    },
    "exchangeSetCellCount": 4,
    "requestedProductCount": 19
  }
}

export const batchStatusCommittedMockData: any = {
  "batchId": "57bcd783-37af-4b04-8c6a-3ac5ed0f1844",
  "status": "Committed"
}

export const batchStatusCommitInProgressMockData: any = {
  "batchId": "57bcd783-37af-4b04-8c6a-3ac5ed0f1844",
  "status": "CommitInProgress"
}

export const batchStatusFailedMockData: any = {
  "batchId": "57bcd783-37af-4b04-8c6a-3ac5ed0f1844",
  "status": "Failed"
}
