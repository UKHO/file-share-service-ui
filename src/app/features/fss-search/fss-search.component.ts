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
  activeSearchType: SearchType;
  displayPopularSearch: boolean;
  eventPopularSearch: Subject<void> = new Subject<void>();
  eventAdvancedSearchTokenRefresh: Subject<void> = new Subject<void>();
  SearchTypeEnum = SearchType;
  MainQueryFilterExpression: string = "";
  filterGroups: FilterGroup[] = [];


  constructor(private msalService: MsalService,
    private fileShareApiService: FileShareApiService,
    private fssSearchValidatorService: FssSearchValidatorService,
    private fssSearchFilterService: FssSearchFilterService,
    private analyticsService: AnalyticsService) {
    this.displayPopularSearch = AppConfigService.settings["fssConfig"].displayPopularSearch;
  }

  ngOnInit(): void {
    this.activeSearchType = SearchType.AdvancedSearch;
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

  refreshToken() {
    this.displayLoader = true;
    this.msalService.loginPopup().subscribe(response => {
      localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
      const idToken = response.idToken;
      localStorage.setItem('idToken', idToken);
      this.msalService.instance.setActiveAccount(response.account);
      //refreshToken endpoint call to set the cookie after user login
      this.fileShareApiService.refreshToken().subscribe(res => {
        this.displayLoader = false;
        this.analyticsService.login();
        this.handleAdvancedSearchTokenRefresh();
      });
    });
    this.hideMessage();
  }

  onAdvancedSearchClicked(fssAdvancedSearch: any) {
    if (this.fssSearchValidatorService.validateSearchInput(
      fssAdvancedSearch.fssSearchRows, fssAdvancedSearch.fields, fssAdvancedSearch.operators)) {
      if (!this.fileShareApiService.isTokenExpired()) {
        var filter = this.fssSearchFilterService.getFilterExpression(
          fssAdvancedSearch.fssSearchRows, fssAdvancedSearch.rowGroupings);
        this.getSearchResult(filter);
      }
      else {
        this.handleTokenExpiry();
      }
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
      this.displayMessage = false;
      if (!this.fileShareApiService.isTokenExpired()) {
        this.MainQueryFilterExpression = this.fssSearchFilterService.getFilterExpressionForSimplifiedSearch(searchFilterText);
        this.fileShareApiService.getAttributeSearchResult(this.MainQueryFilterExpression).subscribe((result) => {
          this.transformSearchAttributesToFilter(result.batchAttributes);
        });
        this.getSearchResult(this.MainQueryFilterExpression);
      }
      else {
        this.handleTokenExpiry();
      }
    } else {
      this.messageTitle = "There is a problem with a field";
      this.messageDesc = "Please enter a search field value.";
      this.showMessage("warning", this.messageTitle, this.messageDesc);
    }
    this.analyticsService.getSimplifiedSearchResult();
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

  onApplyFilterButtonClicked(filterItem: FilterGroup[]){
    if (!this.fileShareApiService.isTokenExpired()) {
      var filterExpression = this.fssSearchFilterService.getFilterExpressionForApplyFilter(filterItem);
      var applyFilter_FilterExpression = this.MainQueryFilterExpression.concat(" AND ").concat("(" + filterExpression + ")");
      this.getSearchResult(applyFilter_FilterExpression);
    }
    else {
      this.handleTokenExpiry();        
    }
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
    var errmsg = "";
    if (err.error != undefined && err.error.errors != undefined && err.error.errors.length > 0) {
      for (let i = 0; i < err.error.errors.length; i++) {
        errmsg += err.error.errors[i]['description'] + '\n';
      }
    }
    else if(err.error != undefined && err.error.message != undefined){
      errmsg = err.error.message;
    }
    if(this.activeSearchType == this.SearchTypeEnum.SimplifiedSearch)
      {
        this.showMessage("error", "There has been an error", "please contact customer services");
      }
      else{
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
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
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

  handleTokenExpiry() {
    this.showMessage("info", "Your Sign-in Token has Expired", "");
    this.loginErrorDisplay = true;
    this.displayLoader = false;
    this.analyticsService.tokenExpired();
  }

  private setPaginatorLabel(currentPage: number) {
    this.paginatorLabel = "Showing " + (((currentPage * this.pageRecordCount) - this.pageRecordCount) + 1) +
      "-" + (((currentPage * this.pageRecordCount) > this.searchResultTotal) ? this.searchResultTotal : (currentPage * this.pageRecordCount)) + " of " + this.searchResultTotal;
  }

  pageChange(currentPage: number) {
    var paginatorAction = this.currentPage > currentPage ? "prev" : "next";
    if (!this.fileShareApiService.isTokenExpired()) {
      this.displayLoader = true;
      this.currentPage = currentPage;
      if (paginatorAction === "next") {
        var nextPageLink = this.pagingLinks!.next!.href;
        this.fileShareApiService.getSearchResult(nextPageLink, true).subscribe((res) => {
          this.searchResult = res;
          this.handleGetSearchResultSuccess();
        },
          (error) => {
            this.handleGetSearchResultFailure(error);
          }
        );
      }
      else if (paginatorAction === "prev") {
        var previousPageLink = this.pagingLinks!.previous!.href;
        this.fileShareApiService.getSearchResult(previousPageLink, true).subscribe((res) => {
          this.searchResult = res;
          this.handleGetSearchResultSuccess();
        },
          (error) => {
            this.handleGetSearchResultFailure(error);
          }
        );
      }
    }
    else {
      this.handleTokenExpiry();
    }
  }

  popularSearchClicked(popularSearch: any) {
    this.eventPopularSearch.next(popularSearch);
  }

  handleAdvancedSearchTokenRefresh() {
    this.eventAdvancedSearchTokenRefresh.next();
  }

  transformSearchAttributesToFilter(attributeSearchResults: any[]) {
    let configAttributes: any[] = [];
    this.filterGroups = [];
    configAttributes = AppConfigService.settings["fssConfig"].batchAttributes;

    if (configAttributes.length > 0 && attributeSearchResults.length > 0) {
      for(let element of configAttributes){
        const attribute = attributeSearchResults.find((searchResult: { key: any; }) => searchResult.key.toLowerCase() === element.attribute.toLowerCase());
        if (attribute) {
          this.filterGroups.push({
            title: element.attribute,
            items: this.getAttributesValues(attribute["values"], element.attributeSortType),
            expanded: true
          });
        }
      }
    }
  }

  getAttributesValues(attributeValues: Array<any> = [],attributeSortType: any) {
    if(attributeSortType==="numeric"){
      attributeValues.sort((a,b) => a.localeCompare(b, 'en', {numeric: true}));
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
