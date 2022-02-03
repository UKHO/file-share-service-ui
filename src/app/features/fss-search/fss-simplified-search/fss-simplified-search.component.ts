import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../../core/services/fss-search-filter.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-fss-simplified-search',
  templateUrl: './fss-simplified-search.component.html',
  styleUrls: ['./fss-simplified-search.component.scss']
})
export class FssSimplifiedSearchComponent implements OnInit {
  fieldValue: string = "";
  
  messageType: 'info' | 'warning' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  displaySearchResult: Boolean = false;
  displayLoader: boolean = false;
  loginErrorDisplay: boolean = false;  
  searchResult: any = [];
  searchResultTotal: number;
  pages: number;
  currentPage: number = 0;
  pagingLinks: any = [];
  paginatorLabel: string;
  pageRecordCount: number = 10;
  @Output() ShowAdvancedSearchClicked = new EventEmitter<boolean>();
  @Output() onSimplifiedSearchClicked = new EventEmitter<string>();
  constructor(private fssSearchFilterService : FssSearchFilterService,
    private fileShareApiService: FileShareApiService,
    private analyticsService: AnalyticsService,
    private msalService: MsalService) { }

  ngOnInit(): void {
  }

  searchToSimplifiedSearch(){
    this.ShowAdvancedSearchClicked.emit();
  }

  getSimplifiedSearchResult() {
    this.onSimplifiedSearchClicked.emit(this.fieldValue);
  }  
}

