import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

describe('FssSearchResultsComponent', () => {
  let component: FssSearchResultsComponent;  
  let fileShareApiService: FileShareApiService;  
  let msalService: MsalService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,        ],
      declarations: [FssSearchResultsComponent],
      providers: [FileShareApiService, MsalService, {
        provide: MSAL_INSTANCE,
        useFactory: MockMSALInstanceFactory       
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
    msalService = TestBed.inject(MsalService)
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FssSearchResultsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});

export function MockMSALInstanceFactory () {    
  return new PublicClientApplication ( {
     auth:{
       clientId:"",
       authority: "",
       redirectUri: "/",
       knownAuthorities: [],
       postLogoutRedirectUri: "/",
       navigateToLoginRequestUrl: false
     },
     cache:{
       cacheLocation: "localStorage",
       storeAuthStateInCookie: true
     }
   })           
 };