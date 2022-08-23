import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, TableModule } from '@ukho/design-system';
import { formatBytes, FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { CardComponent } from '@ukho/design-system';
import { By } from '@angular/platform-browser';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';

import { RouterTestingModule } from '@angular/router/testing';
import { SearchResultViewModel } from 'src/app/core/models/fss-search-results-types';

describe('FssSearchResultsComponent', () => {
  let component: FssSearchResultsComponent;
  let fileShareApiService: FileShareApiService;
  let msalService: MsalService;
  let elementRef: ElementRef;
  let analyticsService: AnalyticsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, TableModule, ButtonModule, RouterTestingModule],
      declarations: [FssSearchResultsComponent, CardComponent],
      providers: [FileShareApiService, MsalService, AnalyticsService, {
        provide: MSAL_INSTANCE,
        useFactory: MockMSALInstanceFactory
      },
      {
        provide: "googleTagManagerId",
        useValue: "YOUR_GTM_ID"
     }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://dummyfssapiurl"
      }
    };
    fileShareApiService = TestBed.inject(FileShareApiService);
    msalService = TestBed.inject(MsalService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should create FssSearchResultsComponent', () => {
    const fixture = TestBed.createComponent(FssSearchResultsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  //Test for search result count
  test('should return search result count 1 when search result for 1 batch is provided', () => {
    component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    component.searchResult = Array.of(SearchResultMockData['entries']);
    component.ngOnChanges();
    var batches = component.searchResult[0];

    expect(batches.length).toEqual(1);
    expect(component.searchResultVM.length).toEqual(1);
  });

  //Test for batch attributes
  test('should return batch attributes when search result data is provided', () => {
    component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    component.searchResult = Array.of(SearchResultMockData['entries']);
    component.ngOnChanges();
    var batches = component.searchResult[0];

    var expectedBatchAttributes = [
      { "key": "product", "value": "TidalPredictionService" },
      { "key": "cellname", "value": "AVCS" }];

    var batchAttributes = component.getBatchAttributes(batches[0]);

    expect(batchAttributes.length).toEqual(2);
    expect(batchAttributes).toEqual(expectedBatchAttributes);
  });

  //Test for system attributes
  test('should return system attributes when search result data is provided', () => {
    component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    component.searchResult = Array.of(SearchResultMockData['entries']);
    component.ngOnChanges();

    var expectedBatchID = { "key": "Batch ID", "value": "9439e409-e545-435c-afd7-f3a5cce527e3" };
    var expectedBatchPublishedDate = { key: 'Batch published date', value: '2021-06-18T12:57:48.853Z' };
    var expectedExpiryDate = { key: 'Batch expiry date', value: '2022-02-28T13:05:10.14Z' };

    var batchID = component.searchResultVM[0].BatchID;
    var batchPublishedDate = component.searchResultVM[0].BatchPublishedDate;
    var expiryDate = component.searchResultVM[0].ExpiryDate;

    expect(batchID).toEqual(expectedBatchID);
    expect(batchPublishedDate).toEqual(expectedBatchPublishedDate);
    expect(expiryDate).toEqual(expectedExpiryDate);
  });

  //Test for file details column headers
  test('should return file details column data', () => {
    component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    component.ngOnChanges();

    var expectedColumnData = ColumnHeader;
    var resultedColumnData = component.getfileDetailsColumnData();

    expect(expectedColumnData).toEqual(resultedColumnData);
  });

  //Test for batch file details
  test('should return batch file details when search result data is provided', () => {
    component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    component.searchResult = Array.of(SearchResultMockData['entries']);
    component.ngOnChanges();
    var batches = component.searchResult[0];

    var expectedBatchFileDetails = {
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

    var batchfileDetails = component.getBatchFileDetails(batches[0]);

    expect(batchfileDetails.rowData.length).toEqual(1);
    expect(batchfileDetails).toEqual(expectedBatchFileDetails);
  });

  test('should return file download link when search result data is provided', fakeAsync(() => {
    const fixture = TestBed.createComponent(FssSearchResultsComponent);
    component = fixture.componentInstance;
    component.searchResult = Array.of(SearchResultMockData['entries']);
    component.ngOnChanges();
    tick(100);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      var ExpectedDownloadFileName = component.searchResultVM[0].batchFileDetails.rowData[0].FileName;
      const element = fixture.nativeElement.querySelectorAll('tr')[5];
      let fileName = element.cells[0].innerHTML;
      expect(element).not.toBeNull();
      expect(fileName).toEqual(ExpectedDownloadFileName);
    })

  }));

  //Test for file size conversion 
  test('should convert file size from bytes to respective size units', () => {
    component = new FssSearchResultsComponent(elementRef, fileShareApiService, analyticsService, msalService);
    component.ngOnChanges();
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
          expect(pnlBatchDetails.querySelector("ukho-dialogue")).toBeNull();
        }
        else
        {
          expect(pnlBatchDetails.querySelector("a").textContent).toContain("batch " + SrNumber);
          expect(pnlBatchDetails.querySelector("a").classList.contains('isDownloadAllDisabled')).toBe(true);
          expect(pnlBatchDetails.querySelector("ukho-dialogue").textContent).toEqual("'Download all' function will be available when the files have been prepared You can select and download individual files, or try again later ");
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