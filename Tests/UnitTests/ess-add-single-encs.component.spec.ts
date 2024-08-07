import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { TableModule } from '../../src/app/shared/components/ukho-table/table.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { ScsProductInformationApiService } from '../../src/app/core/services/scs-product-information-api.service';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { MockMSALInstanceFactory } from './fss-advanced-search.component.spec';
import { HttpClientModule } from '@angular/common/http';
import { ProductCatalog } from 'src/app/core/models/ess-response-types';
import { of, throwError } from 'rxjs';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;
  let service: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  let scsProductInformationApiService: ScsProductInformationApiService;
  let msalService: MsalService;
  let scsProductUpdatesByIdentifiersMockData: ProductCatalog = 
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

  let scsProductUpdatesByIdentifiersResponse: ProductCatalog =
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
      "requestedProductCount": 1,
      "returnedProductCount": 1,
      "requestedProductsAlreadyUpToDateCount": 0,
      "requestedProductsNotReturned": [
        {
          "productName": "US5CN13M",
          "reason": "noDataAvailableForCancelledProduct"
        }
      ]
    }
  };

  const router = {
    navigate: jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TableModule, HttpClientModule],
      declarations: [EssAddSingleEncsComponent , EssInfoErrorMessageComponent],
      providers: [
        EssUploadFileService,
        EssInfoErrorMessageService,
        {
          provide: Router,
          useValue: router
        },
        {
          provide : MsalService,
          useValue : msalService
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        {
          provide : ScsProductInformationApiService,
          useValue : scsProductInformationApiService
        },
        MsalService, ScsProductInformationApiService
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
    msalService = TestBed.inject(MsalService);
    scsProductInformationApiService = TestBed.inject(ScsProductInformationApiService);
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

  it('validateAndAddENC should   raise "Invalid ENC number"error', () => {
    component.txtSingleEnc = 'AU22015';
    component.renderedFrom = 'encList';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Invalid ENC number'
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
      messageDesc : 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site'
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
      messageDesc : 'ENC already in list'
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
      messageDesc : 'Max ENC limit reached'
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


 it('should return sales catalogue Response when user is in essHome screen', fakeAsync(() => {
    component.validEnc = ['AU210130', 'AU210230', 'AU210330', 'AU210180'];
    component.txtSingleEnc = 'AU210470';
    component.renderedFrom = 'essHome';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    component.productUpdatesByIdentifiersResponse(component.validEnc,component.renderedFrom)
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(5).toEqual(scsProductUpdatesByIdentifiersMockData.productCounts.returnedProductCount);
  }));

  it('should return sales catalogue Response when user is in encList screen', fakeAsync(() => {
    component.validEnc = ['AU210130', 'AU210230', 'AU210330', 'AU210180'];
    component.txtSingleEnc = 'AU210470';
    component.renderedFrom = 'encList';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    component.productUpdatesByIdentifiersResponse(component.validEnc,component.renderedFrom)
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(5).toEqual(scsProductUpdatesByIdentifiersMockData.productCounts.returnedProductCount);
  }));

 it('should return Invalid ENC Response when user is added invalid enc', fakeAsync(() => {
    component.validEnc = ['TP4NO13K', 'AT6IIFE1'];
    component.txtSingleEnc = 'US4F8M';
    component.renderedFrom = 'essHome';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
    component.triggerInfoErrorMessage=jest.fn();
    component.productUpdatesByIdentifiersResponse(component.validEnc,'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true,'error', 'Invalid ENC number');
  }));


  it('should return sales catalogue Response on productUpdatesByDeltaResponse when user is on encList screen', fakeAsync(() => {
    component.validEnc = ['AU210130', 'AU210230', 'AU210330', 'AU210180'];
    component.txtSingleEnc = 'AU210470';
    component.renderedFrom = 'encList';
    service.exchangeSetDownloadType = 'Delta';
    service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    jest.spyOn(scsProductInformationApiService,'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    component.fetchScsTokenReponse('encList');
    component.scsProductCatalogResponse(component.validEnc,'encList')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.scsResponse).toEqual(scsProductUpdatesByIdentifiersMockData);
    expect(component.products).toEqual(scsProductUpdatesByIdentifiersMockData.products);
  }));


  it('should return sales catalogue Response on productUpdatesByDeltaResponse when user is on esshome screen ', fakeAsync(() => {
    component.validEnc = ['AU210130', 'AU210230', 'AU210330', 'AU210180'];
    component.txtSingleEnc = 'AU210470';
    component.renderedFrom = 'essHome';
    service.exchangeSetDownloadType = 'Delta';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    jest.spyOn(scsProductInformationApiService,'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    component.fetchScsTokenReponse('essHome');
    component.scsProductCatalogResponse(component.validEnc,'essHome')
    const routeService =jest.spyOn(router,'navigate');
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.scsResponse).toEqual(scsProductUpdatesByIdentifiersMockData);
    expect(routeService).toHaveBeenCalledWith(['exchangesets', 'enc-list']);
  }));

  it('validateAndAddENC should raise "Invalid ENC number" error', fakeAsync(() => {
    component.validEnc = ['TP4NO13K', 'AT6IIFE1'];
    component.txtSingleEnc = 'US4F8M';
    component.renderedFrom = 'essHome';
    service.exchangeSetDownloadType = 'Delta';
    service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
    jest.spyOn(scsProductInformationApiService,'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
    component.triggerInfoErrorMessage=jest.fn();
    component.fetchScsTokenReponse('essHome');
    component.scsProductCatalogResponse(component.validEnc,'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true,'error', 'Invalid ENC number');
  }));

  it('productUpdatesByDeltaResponse should return Error message for productInformationSinceDateTime', fakeAsync(() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.renderedFrom = 'essHome';
    service.exchangeSetDownloadType = 'Delta';
    service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    jest.spyOn(scsProductInformationApiService,'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError(scsProductUpdatesByIdentifiersMockData));
    component.triggerInfoErrorMessage=jest.fn();
    component.fetchScsTokenReponse('essHome');
    component.scsProductCatalogResponse(component.validEnc,'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
  }));

  it('productUpdatesByDeltaResponse should return Error message for productUpdatesByIdentifiersResponse', fakeAsync(() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.renderedFrom = 'essHome';
    service.exchangeSetDownloadType = 'Delta';
    service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(throwError(scsProductUpdatesByIdentifiersMockData));
    component.triggerInfoErrorMessage=jest.fn();
    component.fetchScsTokenReponse('essHome');
    component.scsProductCatalogResponse(component.validEnc,'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
 }));

 it('validation should raise "There has been no updates for the ENCs in the date range selected."info', fakeAsync(() => {
  component.validEnc = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
  component.renderedFrom = 'essHome';
  service.exchangeSetDownloadType = 'Delta';
  service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
  service.setValidENCs(component.validEnc);
  jest.spyOn(scsProductInformationApiService,'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
  jest.spyOn(scsProductInformationApiService,'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
  component.triggerInfoErrorMessage=jest.fn();
  component.fetchScsTokenReponse('essHome');
  component.scsProductCatalogResponse(component.validEnc,'essHome')
  tick();
  expect(component.displayLoader).toEqual(false);
  expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'info', 'There have been no updates for the ENCs in the date range selected');
}));

  it('validation should raise "There has been no updates for the ENCs in the date range selected." when product updates is not available (304 not modified response)', fakeAsync(() => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'DE5NOBRK'];
    component.renderedFrom = 'essHome';
    service.exchangeSetDownloadType = 'Delta';
    service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError({ status: 304 }));
    component.triggerInfoErrorMessage = jest.fn();
    component.fetchScsTokenReponse('essHome');
    component.scsProductCatalogResponse(component.validEnc, 'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'info', 'There have been no updates for the ENCs in the date range selected');
  }));

  it('should return error message for productUpdatesByIdentifiersResponse', fakeAsync(() => {
    component.validEnc = ['AU210130', 'AU210230', 'AU210330', 'AU210180'];
    component.txtSingleEnc = 'AU210470';
    component.renderedFrom = 'essHome';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(throwError(scsProductUpdatesByIdentifiersMockData));
    component.triggerInfoErrorMessage = jest.fn();
    component.fetchScsTokenReponse('essHome');
    component.scsProductCatalogResponse(component.validEnc, 'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
  }));

  it('should return sales catalogue response when user is in essHome screen', fakeAsync(() => {
    component.validEnc = ['AU210130', 'AU210230', 'AU210330', 'AU210180'];
    component.txtSingleEnc = 'AU210470';
    component.renderedFrom = 'essHome';
    service.setValidENCs(component.validEnc);
    jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    component.addSingleEncToList();
    component.fetchScsTokenReponse('essHome');
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(5).toEqual(scsProductUpdatesByIdentifiersMockData.productCounts.returnedProductCount);
  }));


  it('should raise info message for validateAndAddENC "AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site."info', () => {
    component.txtSingleEnc = 'GB800001';
    component.renderedFrom = 'essHome';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage: true,
      messageType: 'info',
      messageDesc: 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
  });

  test('should return scsProductIdentifiersResponse', () => {
    var enc: any[] = ['AU210130'];
    component.renderedFrom = 'essHome';
    component.productUpdatesByIdentifiersResponse(enc, 'essHome');
    scsProductInformationApiService.scsProductIdentifiersResponse(enc).subscribe((res: any) => {
      expect(res).toEqual(scsProductUpdatesByIdentifiersResponse);
    });
  });

  test('should return getProductsFromSpecificDateByScsResponse', () => {
    var enc: any[] = ['AU210130'];
    component.renderedFrom = 'essHome';
    service.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
    component.productUpdatesByDeltaResponse(enc, 'essHome');
    scsProductInformationApiService.getProductsFromSpecificDateByScsResponse().subscribe((res: any) => {
      expect(res).toEqual(scsProductUpdatesByIdentifiersResponse);
    });
  });

});

export const scsProductResponseWithEmptyProductMockData: any = {
  "products": [
  ],
  "productCounts": {
      "requestedProductCount": 0,
      "returnedProductCount": 0,
      "requestedProductsAlreadyUpToDateCount": 0,
      "requestedProductsNotReturned": []
  }
}
