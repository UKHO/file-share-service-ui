import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from '../../src/app/shared/components/ukho-table/table.module';
import { formatBytes, FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { By } from '@angular/platform-browser';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';

import { RouterTestingModule } from '@angular/router/testing';
import { SearchResultViewModel } from 'src/app/core/models/fss-search-results-types';
import { DesignSystemModule } from '@ukho/admiralty-angular';

describe('FssSearchResultsComponent', () => {
  let component: FssSearchResultsComponent;
  //let fileShareApiService: FileShareApiService;
  //let msalService: MsalService;
  //let elementRef: ElementRef;
  //let analyticsService: AnalyticsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TableModule,
        RouterTestingModule,
        DesignSystemModule
      ],
      declarations: [FssSearchResultsComponent],
      providers: [
        FileShareApiService,
        MsalService,
        AnalyticsService, {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
      },
      {
        provide: "googleTagManagerId",
        useValue: "YOUR_GTM_ID"
     }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://dummyfssapiurl"
      }
    };
    //fileShareApiService = TestBed.inject(FileShareApiService);
    //msalService = TestBed.inject(MsalService);
    //analyticsService = TestBed.inject(AnalyticsService);
  });

  function create() {
    const fixture = TestBed.createComponent(FssSearchResultsComponent);
    component = fixture.componentInstance;
    return { fixture };
  }

  it('should create FssSearchResultsComponent', () => {
    const { fixture } = create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  //Test for search result count

  test('should return search result count 1 when search result for 1 batch is provided', () => {
    create();
    component.searchResult = [SearchResultMockData.entries];
    component.ngOnChanges();
    expect(component.searchResult[0].length).toEqual(1);
    expect(component.searchResultVM.length).toEqual(1);
  });

  //Test for batch attributes

  test('should return batch attributes when search result data is provided', () => {
    create();
    component.searchResult = [SearchResultMockData.entries];
    component.ngOnChanges();
    const expected = [
      { key: 'product', value: 'TidalPredictionService' },
      { key: 'cellname', value: 'AVCS' }
    ];
    const batchAttributes = component.getBatchAttributes(component.searchResult[0][0]);
    expect(batchAttributes).toEqual(expected);
  });

  //Test for system attributes

  test('should return system attributes when search result data is provided', () => {
    create();
    component.searchResult = [SearchResultMockData.entries];
    component.ngOnChanges();
    expect(component.searchResultVM[0].BatchID).toEqual({ key: 'Batch ID', value: '9439e409-e545-435c-afd7-f3a5cce527e3' });
    expect(component.searchResultVM[0].BatchPublishedDate).toEqual({ key: 'Batch published date', value: '2021-06-18T12:57:48.853Z' });
    expect(component.searchResultVM[0].ExpiryDate).toEqual({ key: 'Batch expiry date', value: '2022-02-28T13:05:10.14Z' });
  });


  //Test for file details column headers

  test('should return file details column data', () => {
    create();
    component.ngOnChanges();
    expect(component.getfileDetailsColumnData()).toEqual(ColumnHeader);
  });

  //Test for batch file details

  test('should return batch file details when search result data is provided', () => {
    create();
    component.searchResult = [SearchResultMockData.entries];
    component.ngOnChanges();
    const expected = {
      columnData: ColumnHeader,
      rowData: [
        {
          FileName: 'My Test File.txt',
          MimeType: 'image/jpeg',
          FileSize: '3.81 MB',
          FileLink: '/batch/9439e409-e545-435c-afd7-f3a5cce527e3/files/My%20Test%20File.txt'
        }
      ]
    };
    expect(component.getBatchFileDetails(component.searchResult[0][0])).toEqual(expected);
  });


  //test('should return file download link when search result data is provided', fakeAsync(() => {
  //  const fixture = TestBed.createComponent(FssSearchResultsComponent);
  //  component = fixture.componentInstance;
  //  component.searchResult = Array.of(SearchResultMockData['entries']);
  //  component.ngOnChanges();
  //  tick(100);
  //  fixture.detectChanges();
  //  fixture.whenStable().then(() => {
  //    var ExpectedDownloadFileName = component.searchResultVM[0].batchFileDetails.rowData[0].FileName;
  //    const element = fixture.nativeElement.querySelectorAll('admiralty-table-cell')[0];
  //    let fileName = element.innerHTML;
  //    expect(fileName).not.toBeNull();
  //    expect(fileName).toEqual(ExpectedDownloadFileName);
  //  })

  //}));
  test('should return file download link when search result data is provided', fakeAsync(() => {
    const { fixture } = create();
    component.searchResult = [SearchResultMockData.entries];
    component.ngOnChanges();
    tick(50);
    fixture.detectChanges();
    const nameCell = fixture.nativeElement.querySelectorAll('admiralty-table-cell')[0];
    expect(nameCell.innerHTML).toEqual(component.searchResultVM[0].batchFileDetails.rowData[0].FileName);
  }));


  //Test for file size conversion (Rhz commented)
  test('should convert file size from bytes to respective size units', () => {
    //Rhz we don't need the component here, not sure what this is even testing.
    //component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    //component.ngOnChanges();
    var zeroBytes = formatBytes(0);
    var fileSizeBytes = formatBytes(100);
    var fileSizeKB = formatBytes(2000);
    var fileSizeMB = formatBytes(2500000);
    var fileSizeGB = formatBytes(3400000000);

    expect(zeroBytes).toEqual('0 B');
    expect(fileSizeBytes).toEqual('100 B');
    expect(fileSizeKB).toEqual('1.95 KB');
    expect(fileSizeMB).toEqual('2.38 MB');
    expect(fileSizeGB).toEqual('3.17 GB');
  });

  test('should show Download All button when allFilesZipSize is not null', fakeAsync(() => {
    const fixture = TestBed.createComponent(FssSearchResultsComponent);
    component = fixture.componentInstance;
    component.currentPage = 1;
    component.searchResult = Array.of(SearchResultMockDataforShowDownloadAllButton['entries']);
    var batches = component.searchResult[0];
    component.ngOnChanges();
    tick(100);
    fixture.detectChanges();
    expect(batches.length).toBeGreaterThan(0);
    fixture.whenStable().then(() => {
      batches.forEach((item: SearchResultViewModel) => {
        let pnlBatchDetailsId = "[id='" + item.BatchID.value + "']";
        let SrNumber = item.SerialNumber;
        const pnlBatchDetails = fixture.debugElement.query(By.css(pnlBatchDetailsId)).nativeElement;
        if (item.allFilesZipSize) {
          expect(pnlBatchDetails.querySelector("a").textContent).toContain("batch " + SrNumber);
          expect(pnlBatchDetails.querySelector("a").classList.contains('isDownloadAllDisabled')).toBe(false);
          expect(pnlBatchDetails.querySelector("admiralty-dialogue")).toBeNull();
        }
        else
        {
          expect(pnlBatchDetails.querySelector("a").textContent).toContain("batch " + SrNumber);
          expect(pnlBatchDetails.querySelector("a").classList.contains('isDownloadAllDisabled')).toBe(true);
          expect(pnlBatchDetails.querySelector("admiralty-dialogue").heading).toEqual("'Download all' function will be available when the files have been prepared");
          expect(pnlBatchDetails.querySelector("admiralty-dialogue").textContent).toContain("You can select and download individual files, or try again later")
        }
      });
    });
  }));
});

export function MockMSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: "",
      authority: "",
      redirectUri: "/",
      knownAuthorities: [],
      postLogoutRedirectUri: "/",
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  })
};

export const SearchResultMockData: any = {
  "count": 1,
  "total": 1,
  "entries": [
    {
      "batchId": "9439e409-e545-435c-afd7-f3a5cce527e3",
      "status": "Committed",
      "attributes": [
        {
          "key": "product",
          "value": "TidalPredictionService"
        },
        {
          "key": "cellname",
          "value": "AVCS"
        }
      ],
      "businessUnit": "TEST",
      "batchPublishedDate": "2021-06-18T12:57:48.853Z",
      "expiryDate": "2022-02-28T13:05:10.14Z",
      "files": [
        {
          "filename": "My Test File.txt",
          "fileSize": 4000000,
          "mimeType": "image/jpeg",
          "hash": null,
          "attributes": [
            {
              "key": "filetype",
              "value": "Country Delight"
            }
          ],
          "links": {
            "get": {
              "href": "/batch/9439e409-e545-435c-afd7-f3a5cce527e3/files/My%20Test%20File.txt"
            }
          }
        }
      ]
    }
  ],
  "_Links": {
    "self": {
      "href": "/batch?limit=100&start=0&$filter=filesize%20gt%201000"
    },
    "first": {
      "href": "/batch?limit=100&start=0&$filter=filesize%20gt%201000"
    },
    "last": {
      "href": "/batch?limit=100&start=0&$filter=filesize%20gt%201000"
    }
  }
};

export const SearchResultMockDataforShowDownloadAllButton: any = {
  "count": 1,
  "total": 1,
  "entries": [
    {
      "batchId": "9439e409-e545-435c-afd7-f3a5cce527e3",
      "status": "Committed",
      "allFilesZipSize": "1024",
      "BatchID": { "key": 'Batch ID', "value": '9439e409-e545-435c-afd7-f3a5cce527e3' },
      "SerialNumber": "1",
      "attributes": [
        {
          "key": "product",
          "value": "TidalPredictionService"
        },
        {
          "key": "cellname",
          "value": "AVCS"
        }
      ],
      "businessUnit": "TEST",
      "batchPublishedDate": "2021-06-18T12:57:48.853Z",
      "expiryDate": "2022-02-28T13:05:10.14Z",
      "files": [
        {
          "filename": "My Test File.txt",
          "fileSize": 4000000,
          "mimeType": "image/jpeg",
          "hash": null,
          "attributes": [
            {
              "key": "filetype",
              "value": "Country Delight"
            }
          ],
          "links": {
            "get": {
              "href": "/batch/9439e409-e545-435c-afd7-f3a5cce527e3/files/My%20Test%20File.txt"
            }
          }
        }
      ]
    },
    {
      "batchId": "9439e409-e545-435c-afd7-f3a5cce527e2",
      "status": "Committed",
      "allFilesZipSize": "2048",
      "BatchID": { "key": 'Batch ID', "value": '9439e409-e545-435c-afd7-f3a5cce527e2' },
      "SerialNumber": "2",
      "attributes": [
        {
          "key": "product",
          "value": "TidalPredictionService"
        },
        {
          "key": "cellname",
          "value": "AVCS"
        }
      ],
      "businessUnit": "TEST",
      "batchPublishedDate": "2021-06-18T12:57:48.853Z",
      "expiryDate": "2022-02-28T13:05:10.14Z",
      "files": [
        {
          "filename": "My Test File.txt",
          "fileSize": 4000000,
          "mimeType": "image/jpeg",
          "hash": null,
          "attributes": [
            {
              "key": "filetype",
              "value": "Country Delight"
            }
          ],
          "links": {
            "get": {
              "href": "/batch/9439e409-e545-435c-afd7-f3a5cce527e3/files/My%20Test%20File.txt"
            }
          }
        }
      ]
    },
    {
      "batchId": "9439e409-e545-435c-afd7-f3a5cce527e1",
      "status": "Committed",
      "BatchID": { "key": 'Batch ID', "value": '9439e409-e545-435c-afd7-f3a5cce527e1' },
      "SerialNumber": "3",
      "attributes": [
        {
          "key": "product",
          "value": "TidalPredictionService"
        },
        {
          "key": "cellname",
          "value": "AVCS"
        }
      ],
      "businessUnit": "TEST",
      "batchPublishedDate": "2021-06-18T12:57:48.853Z",
      "expiryDate": "2022-02-28T13:05:10.14Z",
      "files": [
        {
          "filename": "My Test File.txt",
          "fileSize": 4000000,
          "mimeType": "image/jpeg",
          "hash": null,
          "attributes": [
            {
              "key": "filetype",
              "value": "Country Delight"
            }
          ],
          "links": {
            "get": {
              "href": "/batch/9439e409-e545-435c-afd7-f3a5cce527e3/files/My%20Test%20File.txt"
            }
          }
        }
      ]
    }
  ],
  "_Links": {
    "self": {
      "href": "/batch?limit=100&start=0&$filter=filesize%20gt%201000"
    },
    "first": {
      "href": "/batch?limit=100&start=0&$filter=filesize%20gt%201000"
    },
    "last": {
      "href": "/batch?limit=100&start=0&$filter=filesize%20gt%201000"
    }
  }
};

export const ColumnHeader: string[] = ['FileName', 'MimeType', 'FileSize', 'Download'];
