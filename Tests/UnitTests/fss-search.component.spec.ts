import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FssSearchComponent } from '../../src/app/features/fss-search/fss-search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

describe('FssSearchComponent', () => {
   let component: FssSearchComponent;
   let fixture: ComponentFixture<FssSearchComponent>;
   let msalService: MsalService;
   let analyticsService: AnalyticsService;
   let router : Router;
   let route : ActivatedRoute;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [HttpClientModule, RouterTestingModule.withRoutes([])],
         declarations: [FssSearchComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            {
               provide: MSAL_INSTANCE,
               useFactory: MockMSALInstanceFactory
            },
            {
               provide: "googleTagManagerId",
               useValue: "YOUR_GTM_ID"
            },
            MsalService,
            AnalyticsService
         ]
      })
         .compileComponents();
      AppConfigService.settings = {
         fssConfig: {
            "apiUrl": "https://dummyfssapiurl ",
            displaySimplifiedSearchLink: true,
            "batchAttributes": [
               {
                   "attributeSortType":"alphabetical",
                   "attribute":"Media Type",
                   "sortOrder":"ascending"
               },
               {
                   "attributeSortType":"alphabetical",
                   "attribute":"Year / Week",
                   "sortOrder":"descending"
               },
               {
                 "attributeSortType":"numeric",
                 "attribute":"Year",
                 "sortOrder":"descending"
               }
             ],
             "maxAttributeValueCount" : 2
         }
      };
      msalService = TestBed.inject(MsalService);
      analyticsService = TestBed.inject(AnalyticsService);
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(FssSearchComponent);
      router = TestBed.get(Router);
      route = TestBed.get(ActivatedRoute);
      component = fixture.componentInstance;
      fixture.detectChanges();

   });

   it('should create FssSearchComponent', () => {
      const fixture = TestBed.createComponent(FssSearchComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
   });

   it('should have filterGroups ordered to match the configuration after transformSearchAttributesToFilter is called', () => {
      const batchAttributesFromConfig = AppConfigService.settings["fssConfig"].batchAttributes;
      //as we defined 3 attributes in test configuration, i.e. "batchAttributes": ["Media Type","Year","Year / Week"]  
      const maxAttributeValueCountFromConfig = AppConfigService.settings["fssConfig"].maxAttributeValueCount;
       //as we defined maxAttributeValueCount is 2 in test configuration
      const expectedFilterGroupLengthFromConfig = 3;
      component.transformSearchAttributesToFilter(inputSearchResultMockData);
      expect(component.filterGroups.length).toEqual(expectedFilterGroupLengthFromConfig);     
      expect(component.filterGroups.filter(filterGroup => filterGroup.hasOwnProperty("title")).map(filterGroup => filterGroup["title"]))
         .toEqual(batchAttributesFromConfig.map((x:any)=>x["attribute"]));
      expect(component.attribute["values"].length).toEqual(maxAttributeValueCountFromConfig);
   });

});

export const inputSearchResultMockData: any =
   [
      {
         "key": "Media Type",
         "values": [
            "CD",
            "DVD",
            "ZIP"
         ]
      },
      {
         "key": "Year",
         "values": [
            "2022",
            "2021",
            "2020"
         ]
      },
      {
         "key": "YEAR / week",
         "values": [
            "2022 / 10",
            "2022 / 11",
            "2021 / 10"
         ]
      }
   ]

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

