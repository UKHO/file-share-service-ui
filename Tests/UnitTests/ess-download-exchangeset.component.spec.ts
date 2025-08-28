import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { ViewportScroller } from '@angular/common';

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
    infoMessage: true,
    addSelectedEnc: jest.fn(),
    removeSelectedEncs: jest.fn(),
    getNotifySingleEnc: jest.fn().mockReturnValue(of(true)),
    getExchangeSetDetails: jest.fn().mockReturnValue(exchangeSetDetailsForDownloadMockData()),
    exchangeSetCreationResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData)),
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
      declarations: [EssDownloadExchangesetComponent, EssInfoErrorMessageComponent],
      providers: [
        {
          provide: EssUploadFileService,
          useValue: service
        },
        {
          provide: ViewportScroller,
          useClass: MockViewportScroller
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

  test('should render text inside an h2 tag', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(' Step 4 of 4  Exchange set creation ');
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(`This can take a few minutes.`);
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p')[1].textContent).toContain('Please do not refresh this page.');
  });

  it('should display download button when batch status is Committed', () => {
    service.getBatchStatus.mockReturnValue(of(batchStatusCommittedMockData));
    component.batchStatusAPI();
    expect(component.exchangeSetLoading).toBe(false);
    expect(component.exchangeSetReady).toBe(true);
    expect(component.downloadComplete).toBe(false);
  });

  it('should hide download button when batch status is CommitInProgress', () => {
    service.getBatchStatus.mockReturnValue(of(batchStatusCommitInProgressMockData));
    component.batchStatusAPI();
    expect(component.exchangeSetLoading).toBe(true);
    expect(component.exchangeSetReady).toBe(false);
    expect(component.downloadComplete).toBe(false);
  });

  it('should show error message when batch status is Failed', () => {
    service.getBatchStatus.mockReturnValue(of(batchStatusFailedMockData));
    component.batchStatusAPI();
    expect(component.exchangeSetLoading).toBe(false);
    expect(component.exchangeSetReady).toBe(false);
    expect(component.downloadComplete).toBe(false);
  });

  it('should display loader when download button is clicked and hide loader after refreshToken API response', () => {
    service.refreshToken.mockReturnValue(of());
    msal_service.instance.acquireTokenSilent.mockReturnValue(of());
    component.download();
    expect(component.displayLoader).toBe(true);
    expect(component.baseUrl).toBeDefined();
    expect(component.downloadPath).toBeDefined();
    expect(component.aioDownloadPath).toBeDefined();
    msal_service.instance.acquireTokenSilent(component.fssSilentTokenRequest).subscribe((response: any) => {
      service.refreshToken().subscribe((res: any) => {
        expect(component.displayLoader).toBe(false);
      });
    });
  });

  it('should not set downloadUrl when exchange set uri is empty in download()', () => {
    service.refreshToken.mockReturnValue(of());

    jest.spyOn(service, 'getExchangeSetDetails').mockReturnValue(exchangeSetDetailsForDownloadMockData());

    msal_service.instance.acquireTokenSilent.mockReturnValue(of());
    component.exchangeSetDetails._links.exchangeSetFileUri.href = '';
    component.download();

    expect(component.downloadPath).toBeUndefined();
  });

  it('should not set aio downloadUrl when exchange set aio uri is empty in download()', () => {
    service.refreshToken.mockReturnValue(of());
    msal_service.instance.acquireTokenSilent.mockReturnValue(of());
    component.exchangeSetDetails._links.aioExchangeSetFileUri.href = '';
    component.download();

    expect(component.aioDownloadUrl).toBeUndefined();
  });

  it('should call refreshToken and open download URLs when downloadFile is called', () => {
    const refreshTokenSpy = jest.spyOn(fileShareApiService, 'refreshToken').mockReturnValue(of({}));
    component.downloadUrl = 'testDownloadUrl';
    component.aioDownloadUrl = 'testAioDownloadUrl';

    component.downloadFile();

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(component.displayLoader).toBe(false);
  });

  it('should not open download URL if empty', () => {
    const refreshTokenSpy = jest.spyOn(fileShareApiService, 'refreshToken').mockReturnValue(of({}));
    component.downloadUrl = '';
    component.aioDownloadUrl = 'testAioDownloadUrl';

    component.downloadFile();
    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(component.displayLoader).toBe(false);
  });


  it('should not open aioDownloadUrl URL if empty', () => {
    const refreshTokenSpy = jest.spyOn(fileShareApiService, 'refreshToken').mockReturnValue(of({}));
    component.downloadUrl = 'testDownloadUrl';
    component.aioDownloadUrl = '';

    component.downloadFile();

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(component.displayLoader).toBe(false);
  });

  it('should not open download URLs if they are empty', () => {
    const refreshTokenSpy = jest.spyOn(fileShareApiService, 'refreshToken').mockReturnValue(of({}));
    component.downloadUrl = '';
    component.aioDownloadUrl = '';

    component.downloadFile();

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(component.displayLoader).toBe(false);
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

  it('when user click on start again then it should navigate to ess landing page', fakeAsync(() => {
    component.switchToESSLandingPage();
    const routeService = jest.spyOn(router, 'navigate');
    tick();
    expect(routeService).toHaveBeenCalledWith(['exchangesets']);
  }));
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
  "exchangeSetUrlExpiryDateTime": new Date("2022-09-02T06:37:34.732Z"),
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
      },
      "aioExchangeSetFileUri": {
        href: "https://uatadmiralty.azure-api.net/fss-qa/batch/91138910-9764-43d7-b6e2-44b90ea64271/files/AIO.zip"
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

class MockViewportScroller implements ViewportScroller {
  setOffset(offset: [number, number] | (() => [number, number])): void {
  }
  getScrollPosition(): [number, number] {
    return [0, 0];
  }
  scrollToPosition(position: [number, number]): void {
  }
  scrollToAnchor(anchor: string): void {
  }
  setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
  }
}
