import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';
import { NO_ERRORS_SCHEMA, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { TableModule } from '../../src/app/shared/components/ukho-table/table.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { ScsProductInformationService } from '../../src/app/core/services/scs-product-information-api.service';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { MockMSALInstanceFactory } from './fss-advanced-search.component.spec';
import { HttpClientModule } from '@angular/common/http';
import { ProductCatalog } from 'src/app/core/models/ess-response-types';
import { of } from 'rxjs';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;
  let service: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  let scsProductInformationService: ScsProductInformationService;
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
          provide : ScsProductInformationService,
          useValue : scsProductInformationService
        },
        MsalService, ScsProductInformationService
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
    scsProductInformationService = TestBed.inject(ScsProductInformationService);
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

  it('validateAndAddENC should   raise "Invalid ENC number."error', () => {
    component.txtSingleEnc = 'AU22015';
    component.renderedFrom = 'encList';
    component.validateAndAddENC();
    const errObj = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Invalid ENC number.'
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
      messageDesc : 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.'
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
      messageDesc : 'ENC already in list.'
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
      messageDesc : 'Max ENC limit reached.'
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

  it('should return sales catalogue Response when user is in essHome screen', () => {
     let addedEncList = ['FR570300', 'SE6IIFE1', 'NO3B2020'];
     component.fetchScsTokenReponse("essHome");
     component.productUpdatesByIdentifiersResponse(addedEncList,"essHome");
     component.processProductUpdatesByIdentifiers(scsProductUpdatesByIdentifiersMockData,"essHome");
     scsProductInformationService.productUpdatesByIdentifiersResponse(addedEncList).subscribe((res: any) => {
     expect(res).toEqual(scsProductUpdatesByIdentifiersMockData);
    });
  });

  it('should return sales catalogue Response when user is in encList screen', () => {
    component.validEnc = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M'];
    component.txtSingleEnc = 'US4FL18M';
    component.renderedFrom = 'encList';
    service.setValidENCs(component.validEnc);
    component.fetchScsTokenReponse("encList");
    component.productUpdatesByIdentifiersResponse(component.validEnc,"encList");
    component.processProductUpdatesByIdentifiers(scsProductUpdatesByIdentifiersMockData,"encList");
    scsProductInformationService.productUpdatesByIdentifiersResponse(component.validEnc).subscribe((res: any) => {
    expect(res).toEqual(scsProductUpdatesByIdentifiersMockData);
   });
 });

 it('should return Invalid ENC Response when user is added invalid enc', fakeAsync(() => {
    component.validEnc = ['TP4NO13K', 'AT6IIFE1'];
    component.txtSingleEnc = 'US4F8M';
    component.renderedFrom = 'essHome';
    service.setValidENCs(component.validEnc);
    scsProductUpdatesByIdentifiersMockData.products = [];
    jest.spyOn(scsProductInformationService,'productUpdatesByIdentifiersResponse').mockReturnValue(of(scsProductUpdatesByIdentifiersMockData));
    component.triggerInfoErrorMessage=jest.fn();
    component.productUpdatesByIdentifiersResponse(component.validEnc,'essHome')
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true,'error', 'Invalid ENC');
  }));
});

export const scsProductUpdatesByIdentifiersMockData: any = {
  "products": [
      {
          "productName": "FR570300",
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
                  "updateApplicationDate": null,
                  "issueDate": "2016-04-27T00:00:00Z"
              },
              {
                  "updateNumber": 2,
                  "updateApplicationDate": null,
                  "issueDate": "2017-01-09T00:00:00Z"
              },
              {
                  "updateNumber": 3,
                  "updateApplicationDate": null,
                  "issueDate": "2017-03-20T00:00:00Z"
              },
              {
                  "updateNumber": 4,
                  "updateApplicationDate": null,
                  "issueDate": "2017-11-14T00:00:00Z"
              },
              {
                  "updateNumber": 5,
                  "updateApplicationDate": null,
                  "issueDate": "2017-12-11T00:00:00Z"
              },
              {
                  "updateNumber": 6,
                  "updateApplicationDate": null,
                  "issueDate": "2018-12-19T00:00:00Z"
              },
              {
                  "updateNumber": 7,
                  "updateApplicationDate": null,
                  "issueDate": "2019-06-28T00:00:00Z"
              },
              {
                  "updateNumber": 8,
                  "updateApplicationDate": null,
                  "issueDate": "2019-10-24T00:00:00Z"
              },
              {
                  "updateNumber": 9,
                  "updateApplicationDate": null,
                  "issueDate": "2021-05-11T00:00:00Z"
              },
              {
                  "updateNumber": 10,
                  "updateApplicationDate": null,
                  "issueDate": "2021-10-08T00:00:00Z"
              },
              {
                  "updateNumber": 11,
                  "updateApplicationDate": null,
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
          "productName": "SE6IIFE1",
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
          "productName": "NO3B2020",
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
      "requestedProductCount": 3,
      "returnedProductCount": 3,
      "requestedProductsAlreadyUpToDateCount": 0,
      "requestedProductsNotReturned": []
  }
}

