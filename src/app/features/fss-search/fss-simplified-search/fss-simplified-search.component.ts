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
  displayDialogMessage: boolean = false;
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
  constructor(private fssSearchFilterService : FssSearchFilterService,
    private fileShareApiService: FileShareApiService,
    private analyticsService: AnalyticsService,
    private msalService: MsalService) { }

  ngOnInit(): void {
  }

  searchToSimplifiedSearch(){
    this.ShowAdvancedSearchClicked.emit();
  }

  getSimplifiedSearchResult(){
   if (this.fieldValue.trim() !== "") {
      this.displayDialogMessage = false;
      this.getSearchResult();
    }else{
      this.messageTitle = "There is a problem with a field";
      this.messageDesc = "Please enter a search field value.";
      this.displayDialogMessage = true;
      this.showMessage(
        "warning",
        this.messageTitle,
        this.messageDesc);
    }
  }

  getSearchResult() {
    
      this.displayLoader = true;
      
      if (!this.fileShareApiService.isTokenExpired()) {
        var filter = this.fssSearchFilterService.getFilterExpressionForSimplifiedSearch();
        console.log(filter);
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
              this.handleSuccess()
            }
            else {
              this.searchResult = res;             
              
                this.searchResult = [];
                this.displaySearchResult = false;
                this.showMessage(
                  "info",
                  "No results can be found for this search",
                  "Try again using different parameters in the search query."
                );
                this.displayLoader = false;
              
            }
          },
            (error) => {
              this.handleErrMessage(error);
            }
          );
        }
      }
      else {
        this.handleTokenExpiry();
      }
    
    
   // this.analyticsService.getSearchResult();
  }

  loginPopup() {
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
      });    
    });
    this.hideMessage();
  }

  handleSuccess() {
    this.pagingLinks = this.searchResult['_Links'];
    this.searchResult = Array.of(this.searchResult['entries']);
    this.displaySearchResult = true;
    this.hideMessage();
    this.setPaginatorLabel(this.currentPage);
    this.displayLoader = false;
  }

  handleErrMessage(err: any) {
    this.displayLoader = false;
    this.displaySearchResult = false;
    var errmsg = "";
    if (err.error != undefined && err.error.errors.length > 0) {
      for (let i = 0; i < err.error.errors.length; i++) {
        errmsg += err.error.errors[i]['description'] + '\n';
      }
      this.showMessage("warning", "An exception occurred when processing this search", errmsg);
    }
    this.analyticsService.errorHandling();
  }

  handleTokenExpiry() {
    this.showMessage("info", "Your Sign-in Token has Expired", "");
    this.loginErrorDisplay = true;
    this.displayLoader = false;
    this.analyticsService.tokenExpired();
  }

  hideMessage() {
    this.messageType = "info";
    this.messageTitle = "";
    this.messageDesc = "";
    this.displayDialogMessage = false;
    this.loginErrorDisplay = false;
  }

  showMessage(messageType: 'info' | 'warning' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayDialogMessage = true;
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
          this.handleSuccess();
        },
          (error) => {
            this.handleErrMessage(error);
          }
        );
      }
      else if (paginatorAction === "prev") {
        var previousPageLink = this.pagingLinks!.previous!.href;
        this.fileShareApiService.getSearchResult(previousPageLink, true).subscribe((res) => {
          this.searchResult = res;
          this.handleSuccess();
        },
          (error) => {
            this.handleErrMessage(error);
          }
        );
      }
    }
    else {
      this.handleTokenExpiry();
    }
  }
  
}

