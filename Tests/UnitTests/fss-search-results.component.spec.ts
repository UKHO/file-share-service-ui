import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';

describe('FssSearchResultsComponent', () => {
  let component: FssSearchResultsComponent;  
  let fileShareApiService: FileShareApiService;  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,        ],
      declarations: [FssSearchResultsComponent],
      providers: [FileShareApiService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://fss-dev-webapp.azurewebsites.net/"
      }
    };
    fileShareApiService = TestBed.inject(FileShareApiService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FssSearchResultsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
