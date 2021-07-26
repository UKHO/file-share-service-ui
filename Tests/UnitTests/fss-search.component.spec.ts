import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, SelectModule, CheckboxModule, TextinputModule, DialogueModule, ExpansionModule, CardModule, TableModule, TypeaheadModule } from '@ukho/design-system';

import { FilterPipe } from '../../src/app/features/fss-search/filter.pipe';
import { FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FssSearchRoutingModule } from '../../src/app/features/fss-search/fss-search-routing.module';
import { FssSearchRowComponent } from '../../src/app/features/fss-search/fss-search-row/fss-search-row.component';
import { FssSearchComponent } from '../../src/app/features/fss-search/fss-search.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';
import { FssSearchFilterService } from '../../src/app/core/services/fss-search-filter.service';
import { Field, FssSearchRow, Operator } from '../../src/app/core/models/fss-search-types';

describe('FssSearchComponent', () => {
  let component: FssSearchComponent;

  let fileShareApiService: FileShareApiService;
  let searchFilterservice: FssSearchFilterService;
  let searchService: FssSearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        FssSearchRoutingModule, HttpClientModule,TypeaheadModule,
        ButtonModule, SelectModule, CheckboxModule, TextinputModule, DialogueModule, ExpansionModule, CardModule, TableModule, TypeaheadModule],
      declarations: [FssSearchComponent,
        FssSearchRowComponent,
        FssSearchResultsComponent,
        FilterPipe],
      providers: [FileShareApiService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
      AppConfigService.settings = {
        fssConfig: {
          "apiUrl": ""
        }
      };
    searchService = TestBed.inject(FssSearchService);
    searchFilterservice = TestBed.inject(FssSearchFilterService);
    fileShareApiService = TestBed.inject(FileShareApiService);
  });

  test('should create', () => {
    const fixture = TestBed.createComponent(FssSearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
