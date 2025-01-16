import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EssListEncsComponent } from '../../src/app/features/exchange-set/ess-list-encs/ess-list-encs.component';
import { TableComponent, TableModule} from '../../src/app/shared/components/ukho-table/table.module';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { CommonModule } from '@angular/common';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ExchangeSetApiService } from '../../src/app/core/services/exchange-set-api.service';
import { By } from '@angular/platform-browser';
import { MockMSALInstanceFactory } from './fss-advanced-search.component.spec';
import { HttpClientModule } from '@angular/common/http';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { DesignSystemModule } from '@ukho/admiralty-angular';
import { Product, ProductCatalog, BundleInfo, DateInfo, NotReturnedProduct, ProductVersionRequest } from '../../src/app/core/models/ess-response-types';
//import { InjectionToken } from '@angular/core';
//import { CDK_TABLE, CdkTable } from '@angular/cdk/table';
//import { CdkTableModule } from '@angular/cdk/table';

describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let msalService: MsalService;
  let exchangeSetApiService: ExchangeSetApiService;
  let essUploadFileService: EssUploadFileService;
  let fixture: ComponentFixture<EssListEncsComponent>;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  let scsProductUpdatesByIdentifiersMockData: any =
  {
    "products": [
      {
        "productName": "AU210130",
        "editionNumber": 5,
        "updateNumbers": [
          0
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2023-03-10T00:00:00Z",
            "issueDate": "2023-03-10T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 26140,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B3"
          }
        ]
      },
      {
        "productName": "AU210230",
        "editionNumber": 1,
        "updateNumbers": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2015-02-25T00:00:00Z",
            "issueDate": "2015-02-25T00:00:00Z"
          },
          {
            "updateNumber": 1,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2016-04-27T00:00:00Z"
          },
          {
            "updateNumber": 2,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2017-01-09T00:00:00Z"
          },
          {
            "updateNumber": 3,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2017-03-20T00:00:00Z"
          },
          {
            "updateNumber": 4,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2017-11-14T00:00:00Z"
          },
          {
            "updateNumber": 5,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2017-12-11T00:00:00Z"
          },
          {
            "updateNumber": 6,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2018-12-19T00:00:00Z"
          },
          {
            "updateNumber": 7,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2019-06-28T00:00:00Z"
          },
          {
            "updateNumber": 8,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2019-10-24T00:00:00Z"
          },
          {
            "updateNumber": 9,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2021-05-11T00:00:00Z"
          },
          {
            "updateNumber": 10,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2021-10-08T00:00:00Z"
          },
          {
            "updateNumber": 11,
            "updateApplicationDate": "2016-04-27T00:00:00Z",
            "issueDate": "2022-11-16T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 343128,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B1"
          }
        ]
      },
      {
        "productName": "AU210330",
        "editionNumber": 3,
        "updateNumbers": [
          0
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2022-12-21T00:00:00Z",
            "issueDate": "2022-12-21T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 123074,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B4"
          }
        ]
      },
      {
        "productName": "AU210180",
        "editionNumber": 13,
        "updateNumbers": [
          0
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2021-03-26T00:00:00Z",
            "issueDate": "2021-03-26T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 7215,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B1"
          }
        ]
      },
      {
        "productName": "AU210470",
        "editionNumber": 2,
        "updateNumbers": [
          0
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2023-05-09T00:00:00Z",
            "issueDate": "2023-05-09T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 637942,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B2"
          }
        ]
      }
    ],
    "productCounts": {
      "requestedProductCount": 6,
      "returnedProductCount": 5,
      "requestedProductsAlreadyUpToDateCount": 0,
      "requestedProductsNotReturned": [
        {
          "productName": "US5CN13M",
          "reason": "noDataAvailableForCancelledProduct"
        }
      ]
    }
  }
  let selectedEncListForDeltaMockData: any =
  {
    "products": [
      {
        "productName": "AU210130",
        "editionNumber": 5,
        "updateNumbers": [
          5, 6, 7
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2023-03-10T00:00:00Z",
            "issueDate": "2023-03-10T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 26140,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B3"
          }
        ]
      }
    ],
    "productCounts": {
      "requestedProductCount": 6,
      "returnedProductCount": 5,
      "requestedProductsAlreadyUpToDateCount": 0,
      "requestedProductsNotReturned": [
        {
          "productName": "US5CN13M",
          "reason": "noDataAvailableForCancelledProduct"
        }
      ]
    }
  }
  let selectedEncListMockData: any =
  {
    "products": [
      {
        "productName": "AU210130",
        "editionNumber": 5,
        "updateNumbers": [
          0
        ],
        "dates": [
          {
            "updateNumber": 0,
            "updateApplicationDate": "2023-03-10T00:00:00Z",
            "issueDate": "2023-03-10T00:00:00Z"
          }
        ],
        "cancellation": null,
        "fileSize": 26140,
        "ignoreCache": false,
        "bundle": [
          {
            "bundleType": "DVD",
            "location": "M1;B3"
          }
        ]
      }
    ],
    "productCounts": {
      "requestedProductCount": 6,
      "returnedProductCount": 5,
      "requestedProductsAlreadyUpToDateCount": 0,
      "requestedProductsNotReturned": [
        {
          "productName": "US5CN13M",
          "reason": "noDataAvailableForCancelledProduct"
        }
      ]
    }
  }
  
  let productCatalog: ProductCatalog = scsProductUpdatesByIdentifiersMockData;
  const router = {
    navigate: jest.fn()
  };
  const service = {
    getValidEncs: jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs: jest.fn(),
    getSelectedENCs: jest.fn().mockReturnValue([]),
    infoMessage: true,
    addSelectedEnc: jest.fn(),
    removeSelectedEncs: jest.fn(),
    getNotifySingleEnc: jest.fn().mockReturnValue(of(true)),
    exchangeSetCreationResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData)),
    addAllSelectedEncs: jest.fn(),
    getEstimatedTotalSize: jest.fn(),
    scsProductResponse: productCatalog,
    scsProducts: productCatalog.products,
    setExchangeSetDetails: jest.fn(),
    exchangeSetCreationForDeltaResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData))
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule,
        TableModule, HttpClientModule, DesignSystemModule],
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
          provide: MsalService,
          useValue: msalService
        },
        {
          provide: ExchangeSetApiService,
          useValue: service
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        
        

        MsalService, ExchangeSetApiService, EssInfoErrorMessageService
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
        MaxEncSelectionLimit: 5,
        aioExcludeEncs :["GB800001","FR800001"]
      },
    };
    window.scrollTo = jest.fn();
    msalService = TestBed.inject(MsalService);
    essUploadFileService = TestBed.inject(EssUploadFileService);
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

  it('handleChange should call service.addSelectedEnc if enc is not present', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange(productCatalog.products[3]);
    expect(service.addSelectedEnc).toHaveBeenCalled();
  });

  it('handleChange should not call service.addSelectedEnc if selected enc"s are greater than MaxEncSelectionLimit', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130', 'AU220830']);
    component.handleChange(productCatalog.products[4]);
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
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130', 'AU220830']);
    let singleProduct: Product[] = [];
    let bundleInfo: BundleInfo[] = [];
    let updateNumber: number[] = [];
    let dateInfo: DateInfo[] = [];
    bundleInfo.push({ bundleType: 'ABC', location: 'XYZ' });
    dateInfo.push({ updateNumber: 1, updateApplicationDate: '01/02/2024', issueDate: '02/03/2024' });
    singleProduct.push({ productName: 'DU314128', editionNumber: 3, updateNumbers: updateNumber, dates: dateInfo, cancellation: null, fileSize: 4, ignoreCache: true, bundle: bundleInfo });
    component.handleChange(singleProduct[0]);
    const errObj = {
      showInfoErrorMessage: true,
      messageType: 'error',
      messageDesc: 'No more than 5 ENCs can be selected'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('should create EssListEncsComponent', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should render text inside an h2 tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(' Step 3 of 4  Confirm exchange set content ');
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      `Please confirm the ENCs that you would like to include in your exchange set.`
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
  ${'0.00MB'}                       |  ${'0.00MB'}
  ${'2.60MB'}                       |  ${'2.60MB'}
  `('getEstimatedTotalSize called from syncEncsBetweenTables and should return string',
    ({ estimatedSize, expectedResult }: { estimatedSize: string; expectedResult: string }) => {
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
    let selectedEncList = ["AU210130", "AU220130", "AU314128", "AU412129", "AU415128", "AU424150", "AU426113", "AU432115", "AU439146", "AU5BTB01", "AU5DAM02", "AU5MEL01", "AU5PTL01", "AU5SYD01", "AU6BTB01", "BR221070", "BR321200", "BR401507", "BR441012"];
    service.exchangeSetCreationResponse(selectedEncList).subscribe((res: any) => {
      expect(res).toEqual(exchangeSetDetailsMockData);
    });
  });

  it('should display Deselect All button when select all button is clicked', () => {
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
    expect(component.showSelectDeselect).toBeTruthy();
  });

  it('should show select all button if enc list less than or equal to max enc limit', () => {
    service.getValidEncs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.ngOnInit();
    expect(component.showSelectDeselect).toBeTruthy();
  });

  it('handleChange should set correct error message and call scrollTo is called when maxEncSelectionLimit limit is exceeded', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128', 'CU314128']);
    component.handleChange(productCatalog.products[0]);
    const errObj = {
      showInfoErrorMessage: true,
      messageType: 'error',
      messageDesc: 'No more than 5 ENCs can be selected'
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
      const errObj = {
        showInfoErrorMessage: false,
        messageType: 'info',
        messageDesc: ''
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });
  });

  it('exchangeSetCreationResponse should set Error message on error', () => {
    let selectedEncList = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.exchangeSetCreationResponse([selectedEncList]);
    exchangeSetApiService.exchangeSetCreationResponse(selectedEncList).subscribe(() => { }, (error: any) => {
      const errObj = {
        showInfoErrorMessage: false,
        messageType: 'error',
        messageDesc: 'There has been an error'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });
  });

  it('ngOnInIt should return valid and inValid cells', () => {
    component.ngOnInit;
    expect(component.scsInvalidProduct.length).toBe(1);
    expect(component.selectedEncList.length).toBe(5);
    const warnObj = {
      showInfoErrorMessage: true,
      messageType: 'warning',
      messageDesc: 'Invalid cells -  US5CN13M'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(warnObj);
  });

  test('getEstimatedTotalSize should return estimatedTotalSize when selectedEncList length is 0', () => {
    component.selectedEncList = [];
    component.getEstimatedTotalSize();
    expect(component.selectedEncList.length).toBe(0);
    expect(component.getEstimatedTotalSize()).toBe('0 MB');
  });

  test('getEstimatedTotalSize should return estimatedTotalSize when selectedEncList length is greater than 0', () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.selectedEncList = service.getSelectedENCs();
    service.getEstimatedTotalSize.mockReturnValue('2.6MB');
    component.getEstimatedTotalSize();
    expect(component.selectedEncList.length).toBeGreaterThan(0);
    expect(component.getEstimatedTotalSize()).toBe('2.6MB');
  });
  
  it('exchangeSetCreationForDeltaResponse should return DeltaExchangeSetResponse for updateNumber - 1 when updateNumber greater then 0', fakeAsync(() => {
    component.selectedEncList = selectedEncListForDeltaMockData.products;
    essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    essUploadFileService.exchangeSetDownloadType = 'Delta';
    jest.spyOn(exchangeSetApiService, 'exchangeSetCreationForDeltaResponse').mockReturnValue(of(exchangeSetDetailsMockData));
    component.scsExchangeSetResponse();
    tick();
    expect(4).toEqual(component.updateNumber);
  }));

  it('exchangeSetCreationForDeltaResponse should return DeltaExchangeSetResponse for editionNumber - 1 when updateNumber is 0', fakeAsync(() => {
    component.selectedEncList = selectedEncListMockData.products;
    essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    essUploadFileService.exchangeSetDownloadType = 'Delta';
    jest.spyOn(exchangeSetApiService, 'exchangeSetCreationForDeltaResponse').mockReturnValue(of(exchangeSetDetailsMockData));
    component.scsExchangeSetResponse();
    tick();
    expect(4).toEqual(component.editionNumber);
  }));

  it('exchangeSetCreationForDeltaResponse should return DeltaExchangeSetResponse', fakeAsync(() => {
    component.selectedEncList = selectedEncListMockData.products;
    essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    essUploadFileService.exchangeSetDownloadType = 'Delta';
    jest.spyOn(exchangeSetApiService, 'exchangeSetCreationForDeltaResponse').mockReturnValue(of(exchangeSetDetailsMockData));
    component.scsExchangeSetResponse();
    const routeService = jest.spyOn(router, 'navigate');
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(exchangeSetDetailsMockData).toEqual(exchangeSetDetailsMockData);
    expect(routeService).toHaveBeenCalledWith(['exchangesets', 'enc-download']);
  }));

  it('exchangeSetCreationForDeltaResponse should set Error message on error', fakeAsync(() => {
    component.selectedEncList = selectedEncListMockData.products;
    essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    essUploadFileService.exchangeSetDownloadType = 'Delta';
    jest.spyOn(exchangeSetApiService, 'exchangeSetCreationForDeltaResponse').mockReturnValue(throwError(exchangeSetDetailsMockData));
    component.triggerInfoErrorMessage = jest.fn();
    component.scsExchangeSetResponse();
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
  }));

  it('exchangeSetCreationResponse should return exchangeSetCreationResponse', fakeAsync(() => {
    component.selectedEncList = selectedEncListMockData.products;
    essUploadFileService.exchangeSetDownloadType = 'Base';
    jest.spyOn(exchangeSetApiService, 'exchangeSetCreationResponse').mockReturnValue(of(exchangeSetDetailsMockData));
    component.scsExchangeSetResponse();
    const routeService = jest.spyOn(router, 'navigate');
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(exchangeSetDetailsMockData).toEqual(exchangeSetDetailsMockData);
    expect(routeService).toHaveBeenCalledWith(['exchangesets', 'enc-download']);
  }));

  it('exchangeSetCreationResponse should set Error message on error', fakeAsync(() => {
    component.selectedEncList = selectedEncListMockData.products;
    essUploadFileService.exchangeSetDownloadType = 'Base';
    jest.spyOn(exchangeSetApiService,'exchangeSetCreationResponse').mockReturnValue(throwError(exchangeSetDetailsMockData));
    component.triggerInfoErrorMessage = jest.fn();
    component.scsExchangeSetResponse();
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
  }));

  it('when user click on start again then it should navigate to ess landing page', fakeAsync(() => {
    component.switchToESSLandingPage();
    const routeService = jest.spyOn(router, 'navigate');
    tick();
    expect(routeService).toHaveBeenCalledWith(['exchangesets']);
  }));

  it('requestEncClicked should return exchangeSetResponse', fakeAsync(() => {
    component.selectedEncList = selectedEncListMockData.products;
    essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    essUploadFileService.exchangeSetDownloadType = 'Delta';
    component.requestEncClicked();
    tick();
    expect(component.displayLoader).toEqual(true);
  }));

  test('should return exchangeSet response for delta', () => {
    let selectedEncList: ProductVersionRequest[] = [{ productName: 'AU210130', editionNumber: 1, updateNumber: 3 }];
    component.exchangeSetCreationForDeltaResponse(selectedEncList);
    service.exchangeSetCreationForDeltaResponse(selectedEncList).subscribe((res: any) => {
      expect(res).toEqual(exchangeSetDetailsMockData);
    });
  });

  it('should raise info message for aio enc cell', () => {
    var notReturnedProduct: NotReturnedProduct[] = [];
    component.scsInvalidProduct = notReturnedProduct;
    essUploadFileService.aioEncFound = true;
    component.ngOnInit();
    expect(component.scsInvalidProduct.length).toEqual(0);
    const errObj = {
      showInfoErrorMessage: true,
      messageType: 'info',
      messageDesc: 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('should raise warning message for aio enc cell with invalid enc cells', () => {
    var notReturnedProduct: NotReturnedProduct[] = [{ productName: 'AU210130', reason: 'check aio' }];
    component.scsInvalidProduct = notReturnedProduct;
    essUploadFileService.aioEncFound = true;
    component.ngOnInit();
    expect(component.scsInvalidProduct.length).toEqual(1);
    const errObj = {
      showInfoErrorMessage: true,
      messageType: 'warning',
      messageDesc: 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.<br/> Invalid cells -  AU210130.'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  it('should have "S63 Exchange Set" selected by default',()=>{
    expect(component.selectedOption).toEqual('S63');
  });
  
  it('should display radio buttons when user is privileged', () => {
    component.isPrivilegedUser = true;
    fixture.detectChanges();
    const radioButtons = fixture.debugElement.queryAll(By.css('admiralty-radio'));
    expect(radioButtons.length).toBeGreaterThan(0);
  });

  it('should not display radio buttons when user is not privileged', () => {
    component.isPrivilegedUser = false;
    fixture.detectChanges();
    const radioButtons = fixture.debugElement.queryAll(By.css('admiralty-radio'));
    expect(radioButtons.length).toBe(0);
  });

  it('should set exchangeSetDownloadZipType to S57 when essDownloadZipType is called with S57', () => {
    component.essDownloadZipType('S57');
    expect(essUploadFileService.exchangeSetDownloadZipType).toBe('S57');
  });

  it('should set exchangeSetDownloadZipType to S63 when essDownloadZipType is called with S63', () => {
    component.essDownloadZipType('S63');
    expect(essUploadFileService.exchangeSetDownloadZipType).toBe('S63');
  });

  it('should set exchangeSetDownloadZipType to S63 when essDownloadZipType is called with any other value', () => {
    component.essDownloadZipType('other');
    expect(essUploadFileService.exchangeSetDownloadZipType).toBe('S63');
  });

  it('when "Request ENCs" button is clicked, at least one radio button must be selected',()=>{
    let requestENCs = fixture.debugElement.nativeElement.querySelector('admiralty-button');
    requestENCs.click();

    expect(component.selectedOption).toBeTruthy();
  });

  it('should render "Estimated exchange set size" when "S63 Exchange Set"radio button is selected', () => {
    component.selectedOption = component.s63OptionValue;
    fixture.detectChanges();
    const paragraph = fixture.debugElement.query(By.css('.estimatedExchangeSetSize'));
    expect(paragraph).toBeTruthy();
  });

  it('should not render paragraph when selectedOption is not equal to s63OptionValue', () => {
    component.selectedOption = component.s57OptionValue;
    fixture.detectChanges();
    const paragraph = fixture.debugElement.query(By.css('.estimatedExchangeSetSize'));
    expect(paragraph).toBeNull();
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
  requestedProductCount: 19,
  "exchangeSetCellCount": 4,
  requestedProductsAlreadyUpToDateCount: 0,
  "requestedProductsNotInExchangeSet": [
    {
      productName: "AU210130",
      "reason": "invalidProduct"
    },
    {
      productName: "AU220130",
      "reason": "invalidProduct"
    },
    {
      productName: "AU314128",
      "reason": "invalidProduct"
    },
    {
      productName: "AU412129",
      "reason": "invalidProduct"
    },
    {
      productName: "AU415128",
      "reason": "invalidProduct"
    },
    {
      productName: "AU424150",
      "reason": "invalidProduct"
    },
    {
      productName: "AU426113",
      "reason": "invalidProduct"
    },
    {
      productName: "AU432115",
      "reason": "invalidProduct"
    },
    {
      productName: "AU439146",
      "reason": "invalidProduct"
    },
    {
      productName: "AU5BTB01",
      "reason": "invalidProduct"
    },
    {
      productName: "AU5DAM02",
      "reason": "invalidProduct"
    },
    {
      productName: "AU5MEL01",
      "reason": "invalidProduct"
    },
    {
      productName: "AU5PTL01",
      "reason": "invalidProduct"
    },
    {
      productName: "AU5SYD01",
      "reason": "invalidProduct"
    },
    {
      productName: "AU6BTB01",
      "reason": "invalidProduct"
    }
  ]
}
