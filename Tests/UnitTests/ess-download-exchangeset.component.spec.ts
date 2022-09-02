import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssDownloadExchangesetComponent } from '../../src/app/features/exchange-set/ess-download-exchangeset/ess-download-exchangeset.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('EssDownloadExchangesetComponent', () => {
  let component: EssDownloadExchangesetComponent;
  let fixture: ComponentFixture<EssDownloadExchangesetComponent>;
  const router = {
    navigate: jest.fn()
  };

  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn(),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
    getNotifySingleEnc : jest.fn().mockReturnValue(of(true)),
    getExchangeSetDetails: jest.fn().mockReturnValue({exchangeSetCellCount : 4}),
    exchangeSetCreationResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData)),
    getEstimatedTotalSize:jest.fn()
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ EssDownloadExchangesetComponent ],
      providers: [
        {
          provide : EssUploadFileService,
          useValue : service
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5,
      avgSizeofENC: 0.3
      }
    };
    fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EssDownloadExchangesetComponent', () => {
    const fixture = TestBed.createComponent(EssDownloadExchangesetComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
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
    let selectedEncList = ["AU6BTB01","BR221070","BR321200","BR401507"];
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

    var expectedResultForKB: any = '0KB';
    service.getEstimatedTotalSize.mockReturnValue('0KB');
    component.ngOnInit();
    expect(service.getEstimatedTotalSize).toHaveBeenCalled();
    expect(component.avgEstimatedSize).toBe(expectedResultForKB);
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