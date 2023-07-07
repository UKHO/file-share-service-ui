import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { FssSearchValidatorService } from '../../core/services/fss-search-validator.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';
import { Subject } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { SearchType } from '../../core/models/fss-search-types';
import { FilterGroup, FilterItem } from '@ukho/design-system';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SilentRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-fss-search',
  templateUrl: './fss-search.component.html',
  styleUrls: ['./fss-search.component.scss']
})
export class FssSearchComponent implements OnInit {
  displayLoader: boolean = false;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  displayMessage: boolean = false;
  loginErrorDisplay: boolean = false;
  displaySearchResult: Boolean = false;
  searchResult: any = [];
  pagingLinks: any = [];
  searchResultTotal: number;
  pages: number;
  currentPage: number = 0;
  paginatorLabel: string;
  pageRecordCount: number = 10;
  errorMessageTitle: string = "";
  errorMessageDescription: string = "";
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  @ViewChild("showSearchResult") showSearchResult: ElementRef;
  @ViewChild('UkhoAdvanceSearch', { read: ElementRef }) UkhoAdvanceSearch: ElementRef;
  activeSearchType: SearchType;
  displayPopularSearch: boolean;
  eventPopularSearch: Subject<void> = new Subject<void>();
  eventAdvancedSearchTokenRefresh: Subject<void> = new Subject<void>();
  SearchTypeEnum = SearchType;
  MainQueryFilterExpression: string = "";
  filterGroups: FilterGroup[] = [];
  TooManyRequest: number = 429;
  currentUrl: any = '';
  fssTokenScope: any = [];
  fssSilentTokenRequest: SilentRequest;
  attribute : any =[];

  constructor(private msalService: MsalService,
    private fileShareApiService: FileShareApiService,
    private fssSearchValidatorService: FssSearchValidatorService,
    private fssSearchFilterService: FssSearchFilterService,
    private analyticsService: AnalyticsService, private titleService: Title, private router: Router) {
    this.displayPopularSearch = AppConfigService.settings["fssConfig"].displayPopularSearch;
    this.fssTokenScope = AppConfigService.settings["fssConfig"].apiScope;
    this.fssSilentTokenRequest = {
      scopes: [this.fssTokenScope],
    };
  };

  ngOnInit(): void {
    this.activeSearchType = SearchType.SimplifiedSearch;
  }

  ShowAdvancedSearchClicked() {
    this.activeSearchType = SearchType.AdvancedSearch;
    this.displaySearchResult = false;
    this.displayMessage = false;
  }

  ShowSimplifiedSearchClicked() {
    this.activeSearchType = SearchType.SimplifiedSearch;
    this.displaySearchResult = false;
    this.displayMessage = false;
  }

  onAdvancedSearchClicked(fssAdvancedSearch: any) {
    if (this.fssSearchValidatorService.validateSearchInput(
      fssAdvancedSearch.fssSearchRows, fssAdvancedSearch.fields, fssAdvancedSearch.operators)) {
      var filter = this.fssSearchFilterService.getFilterExpression(
        fssAdvancedSearch.fssSearchRows, fssAdvancedSearch.rowGroupings);
      this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
        this.getSearchResult(filter);
      }, error => {
        this.msalService.instance
          .loginPopup(this.fssSilentTokenRequest)
          .then(response => {
            this.getSearchResult(filter);
          })
      })
    }
    else {
      this.errorMessageDescription = this.fssSearchValidatorService.errorMessageDescription;
      this.errorMessageTitle = this.fssSearchValidatorService.errorMessageTitle;
      this.searchResult = [];
      this.displaySearchResult = false;
      this.showMessage("warning", this.errorMessageTitle, this.errorMessageDescription);
    }
    this.analyticsService.getAdvancedSearchResult();
  }

  onSimplifiedSearchClicked(searchFilterText: string) {
    this.displaySearchResult = false;
    if (searchFilterText.trim() !== "") {
      this.displayLoader = true;
      this.displayMessage = false;
      this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
        this.getSimplifiedSearchApiResult(searchFilterText);
      }, error => {
        this.msalService.instance
          .loginPopup(this.fssSilentTokenRequest)
          .then(response => {
            this.getSimplifiedSearchApiResult(searchFilterText);
          })
      })
    } else {
      this.messageTitle = "There is a problem with a field";
      this.messageDesc = "Please enter a search field value.";
      this.showMessage("warning", this.messageTitle, this.messageDesc);
    }
    this.analyticsService.getSimplifiedSearchResult();
  }

  getSimplifiedSearchApiResult(searchFilterText: string) {
    this.MainQueryFilterExpression = this.fssSearchFilterService.getFilterExpressionForSimplifiedSearch(searchFilterText);
    this.fileShareApiService.getAttributeSearchResult(this.MainQueryFilterExpression).subscribe((result) => {
      this.transformSearchAttributesToFilter(result.batchAttributes);
    });
    this.getSearchResult(this.MainQueryFilterExpression);
  }

  getSearchResult(filter: string) {
    this.displayLoader = true;
    if (filter != null) {
      this.searchResult = [];
      this.fileShareApiService.getSearchResult(filter, false).subscribe((res) => {
        this.searchResult = res;
        if (this.searchResult.count > 0) {
          var searchResultCount = this.searchResult['count'];
          this.searchResultTotal = this.searchResult['total'];
          this.currentPage = 1;
          this.pages = this.searchResultTotal % searchResultCount === 0 ?
            Math.floor(this.searchResultTotal / searchResultCount) :
            (Math.floor(this.searchResultTotal / searchResultCount) + 1);
          this.handleGetSearchResultSuccess()
        }
        else {
          this.searchResult = [];
          this.displaySearchResult = false;
          this.showMessage("info", "No results can be found for this search", "Try again using different parameters in the search query.");
          this.displayLoader = false;
        }
      },
        (error) => {
          this.handleGetSearchResultFailure(error);
        }
      );
    }
  }

  onApplyFilterButtonClicked(filterItem: FilterGroup[]) {
    var filterExpression = this.fssSearchFilterService.getFilterExpressionForApplyFilter(filterItem);
    var applyFilter_FilterExpression = filterExpression ? this.MainQueryFilterExpression.concat(" AND ").concat("(" + filterExpression + ")") : this.MainQueryFilterExpression;
    this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
      this.getSearchResult(applyFilter_FilterExpression);
    }, error => {

      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.getSearchResult(applyFilter_FilterExpression);
        })
    });
  }

  handleGetSearchResultSuccess() {
    this.pagingLinks = this.searchResult['_Links'];
    this.searchResult = Array.of(this.searchResult['entries']);
    this.displaySearchResult = true;
    this.hideMessage();
    this.setPaginatorLabel(this.currentPage);
    this.displayLoader = false;
  }

  handleGetSearchResultFailure(err: any) {
    this.displayLoader = false;
    this.displaySearchResult = false;
    let errmsg = "";
    if (err.error != undefined && err.error.errors != undefined && err.error.errors.length > 0) {
      for (let i = 0; i < err.error.errors.length; i++) {
        errmsg += err.error.errors[i]['description'] + '\n';
      }
    }
    else if (err.error != undefined && err.error.message != undefined) {
      errmsg = err.error.message;
    }
    if (err.error.statusCode == this.TooManyRequest) {
      this.showMessage("error", "There has been an error", "Too many requests in a short period of time, please try again");
    }
    else if (this.activeSearchType == this.SearchTypeEnum.SimplifiedSearch) {

      this.showMessage("error", "There has been an error", "please contact customer services");
    }
    else {
      this.showMessage("warning", "An exception occurred when processing this search", errmsg);
    }
    this.analyticsService.errorHandling();
  }

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '-1');
      this.ukhoDialog.nativeElement.focus();
    }
    if (this.displayLoader === false) {
      window.scroll({
        top: 150,
        behavior: 'smooth'
      });
    }
  }

  hideMessage() {
    this.messageType = "info";
    this.messageTitle = "";
    this.messageDesc = "";
    this.displayMessage = false;
    this.loginErrorDisplay = false;
  }

  searchResultsFocus() {
    if (this.showSearchResult !== undefined) {
      this.showSearchResult.nativeElement.setAttribute('tabindex', '-1');
      this.showSearchResult.nativeElement.focus();
    }
  }

  private setPaginatorLabel(currentPage: number) {
    this.paginatorLabel = "Showing " + (((currentPage * this.pageRecordCount) - this.pageRecordCount) + 1) +
      "-" + (((currentPage * this.pageRecordCount) > this.searchResultTotal) ? this.searchResultTotal : (currentPage * this.pageRecordCount)) + " of " + this.searchResultTotal;
  }

  onPageChangeHandler(value: Event) {
    console.log(value)
  }

  pageChange(currentPage: number) {
    var paginatorAction = this.currentPage > currentPage ? "prev" : "next";
    this.displayLoader = true;
    this.currentPage = currentPage;
    if (paginatorAction === "next") {
      var nextPageLink = this.pagingLinks!.next!.href;
      this.getPaginatorApiResponse(nextPageLink);
    }
    else if (paginatorAction === "prev") {
      var previousPageLink = this.pagingLinks!.previous!.href;
      this.getPaginatorApiResponse(previousPageLink);
    }
    if (this.searchResult.length > 0) {
      this.searchResultsFocus();
    }
  }

  getPaginatorApiResponse(pageLink: string) {
    this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
      this.fileShareApiService.getSearchResult(pageLink, true).subscribe((res) => {
        this.searchResult = res;
        this.handleGetSearchResultSuccess();
      },
        (error) => {
          this.handleGetSearchResultFailure(error);
        }
      );
    }, error => {

      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.fileShareApiService.getSearchResult(pageLink, true).subscribe((res) => {
            this.searchResult = res;
            this.handleGetSearchResultSuccess();
          },
            (error) => {
              this.handleGetSearchResultFailure(error);
            }
          );
        })
    });

  }

  popularSearchClicked(popularSearch: any) {
    this.eventPopularSearch.next(popularSearch);
    if (this.UkhoAdvanceSearch !== undefined) {
      this.UkhoAdvanceSearch.nativeElement.setAttribute('tabindex', '-1');
      this.UkhoAdvanceSearch.nativeElement.focus();
    }
  }

  handleAdvancedSearchTokenRefresh() {
    this.eventAdvancedSearchTokenRefresh.next();
  }

  transformSearchAttributesToFilter(attributeSearchResults: any[]) {
    let configAttributes: any[] = [];
    this.filterGroups = [];
    configAttributes = AppConfigService.settings["fssConfig"].batchAttributes;

    if (configAttributes.length > 0 && attributeSearchResults.length > 0) {
      for (let element of configAttributes) {
        this.attribute = [];
        this.attribute = attributeSearchResults.find((searchResult: { key: any; }) => searchResult.key.toLowerCase() === element.attribute.toLowerCase());
        if (this.attribute) {
          if (this.attribute["values"].length > 1) {
            this.attribute["values"].splice(AppConfigService.settings['fssConfig'].maxAttributeValueCount, 1);        
            this.filterGroups.push({
              title: element.attribute,
              items: this.getAttributesValues(this.attribute["values"], element.attributeSortType, element.sortOrder),
              expanded: true
            });
          }
        }
      }
    }
  }

  getAttributesValues(attributeValues: Array<any> = [], attributeSortType: any, sortOrder: any) {
    if (attributeSortType === "alphabetical" && sortOrder === "ascending") {
      attributeValues.sort();
    }
    else if (attributeSortType === "alphabetical" && sortOrder === "descending") {
      attributeValues.sort((a, b) => (a > b ? -1 : 1));
    }
    else if (attributeSortType === "numeric" && sortOrder === "ascending") {
      attributeValues.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    }
    else if (attributeSortType === "numeric" && sortOrder === "descending") {
      attributeValues.sort((a, b) => b.localeCompare(a, 'en', { numeric: true }));
    }

    const batchAttributeValues: FilterItem[] = [];
    for (let i = 0; i < attributeValues.length; i++) {
      batchAttributeValues.push({
        title: attributeValues[i],
        selected: false
      });
    }
    return batchAttributeValues;
  }

}
