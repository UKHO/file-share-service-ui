import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FssSearchService } from './../../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow, RowGrouping, UIGroupingDetails, GroupingLevel, UIGrouping } from './../../../core/models/fss-search-types';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { Observable, Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { FssSearchHelperService } from '../../../core/services/fss-search-helper.service';
import { FssSearchValidatorService } from '../../../core/services/fss-search-validator.service';
import { FssSearchGroupingService } from '../../../core/services/fss-search-grouping.service';
import { FssPopularSearchService } from '../../../core/services/fss-popular-search.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-fss-advanced-search',
  templateUrl: './fss-advanced-search.component.html',
  styleUrls: ['./fss-advanced-search.component.scss'],
  providers: [
    { provide: IFssSearchService, useClass: FssSearchService }
  ]
})
export class FssAdvancedSearchComponent implements OnInit {

  joinOperators: JoinOperator[] = [];
  fields: Field[] = [];
  operators: Operator[] = [];
  fssSearchRows: FssSearchRow[] = [];
  rowId: number = 1;
  searchResult: any = [];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  displayMessage: boolean = false;
  displaySearchResult: Boolean = false;
  displayLoader: boolean = false;
  userAttributes: Field[] = [];
  errorMessageTitle: string = "";
  errorMessageDescription: string = "";
  filterList: string[] = new Array<string>();
  typeaheadFields: (filterTerm: string) => string[] | Observable<string[]>;
  selectedRow: number;
  userLocalTimeZone = this.getLocalTimeFormat();
  pageRecordCount: number = 10;  
  pagingLinks: any = [];
  pages: number;
  currentPage: number = 0;
  paginatorLabel: string;
  loginErrorDisplay: boolean = false;
  uiGroupingDetails: UIGroupingDetails = new UIGroupingDetails();
  currentGroupStartIndex: number = 0;
  currentGroupEndIndex: number = 0;
  rowGroupings: RowGrouping[] = [];
  groupingLevels: GroupingLevel[] = [];
  uiGroupings: UIGrouping[] = [];
  displaySearchBatchWeekFiles: boolean = false;
  displaySimplifiedSearchLink: boolean;
  ShowAdvancedSearch: boolean = true;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  @Output() ShowSimplifiedSearchClicked = new EventEmitter<boolean>();
  @Output() onAdvancedSearchClicked = new EventEmitter<{ fssSearchRows: FssSearchRow[], fields: Field[], operators: Operator[], rowGroupings: RowGrouping[] }>();
  
  private subscriptionPopularSearch: Subscription;
  @Input() observablePopularSearch: Observable<any>;

  private subscriptionAdvancedSearchTokenRefresh: Subscription;
  @Input() observableAdvancedSearchTokenRefresh: Observable<void>;

  constructor(private fssSearchTypeService: IFssSearchService,    
    private fileShareApiService: FileShareApiService,
    private elementRef: ElementRef,    
    private fssSearchHelperService: FssSearchHelperService,
    private fssSearchValidatorService: FssSearchValidatorService,
    private fssSearchGroupingService: FssSearchGroupingService,
    private fssPopularSearchService: FssPopularSearchService,
    private analyticsService: AnalyticsService) { 
    this.displaySimplifiedSearchLink = AppConfigService.settings["fssConfig"].displaySimplifiedSearchLink;
  }

  getPopularSearch(popularSearch: any) {
    this.rowGroupings = [];
    this.setupGrouping();
    this.fssSearchRows = [];
    var isPopularSearch = true;
    for (let i = 0; i < popularSearch.rows.length; i++) {
      this.addSearchRow(isPopularSearch);
    }
    this.fssPopularSearchService.populateQueryEditor(this.fssSearchRows, popularSearch, this.operators, this.rowGroupings);
    this.setupGrouping();  
    this.getAdvancedSearchResult();
  }

  ngOnInit(): void {
    this.joinOperators = this.fssSearchTypeService.getJoinOperators();
    this.operators = this.fssSearchTypeService.getOperators();
    if (!localStorage['batchAttributes']) {
      this.displayLoader = true;
      if (!this.fileShareApiService.isTokenExpired()) {
        this.fileShareApiService.getBatchAttributes().subscribe((batchAttributeResult) => {
          localStorage.setItem('batchAttributes', JSON.stringify(batchAttributeResult));
          this.refreshFields(batchAttributeResult);
          this.addSearchRow();         
          this.displayLoader = false;
          this.analyticsService.searchInIt();
        });
      }
      else {
        this.handleTokenExpiry();
      }
    }
    else {
      var batchAttributeResult = JSON.parse(localStorage.getItem('batchAttributes')!);
      this.refreshFields(batchAttributeResult);
      this.addSearchRow();
    }

    this.subscriptionPopularSearch = this.observablePopularSearch.subscribe((data) => 
      this.getPopularSearch(data));

    this.subscriptionAdvancedSearchTokenRefresh = this.observableAdvancedSearchTokenRefresh.subscribe(() => 
      this.getBatchAttributes());
  }

  ngOnDestroy() {
    if (this.subscriptionPopularSearch)
    {
      this.subscriptionPopularSearch.unsubscribe();
    }
    if (this.subscriptionAdvancedSearchTokenRefresh)
    {
      this.subscriptionAdvancedSearchTokenRefresh.unsubscribe();
    }
  }

  getLocalTimeFormat() {
    return this.executeRegex(new Date().toTimeString(), /\(([^)]+)\)/);
  }

  executeRegex(valueField: any, regex: any) {
    var regExp = new RegExp(regex, "i");
    return regExp.exec(valueField)![1];
  }

  getBatchAttributes() {
    this.fileShareApiService.getBatchAttributes().subscribe((batchAttributeResult) => {
        localStorage.setItem('batchAttributes', JSON.stringify(batchAttributeResult));   
        this.refreshFields(batchAttributeResult);
        this.refreshExistingFssRowsFields();
      });    
  }

  refreshFields(batchAttributeResult: any) {
    this.filterList = [];
    this.fields = this.fssSearchTypeService.getFields(batchAttributeResult);
    for (let i = 0; i < this.fields.length; i++) {
      this.filterList.push(this.fields[i].text)
    }
    this.typeaheadFields = this.filter(this.filterList);
  }

  refreshExistingFssRowsFields()
  {
    this.fssSearchRows.forEach(fssSearchRow => {
      fssSearchRow.fields = this.fields;
      fssSearchRow.filterFn = this.typeaheadFields;
    });
  }

  addSearchRow(isPopularSearch?: boolean) {
    this.fssSearchRows.push(this.getDefaultSearchRow());
    this.rowId += 1;
    if (!isPopularSearch) {
      setTimeout(() => {
        var inputs = this.elementRef.nativeElement.querySelectorAll('.ukhoTypeahead ukho-textinput input');
        if (this.fssSearchRows.length > 1) {
          inputs[this.fssSearchRows.length - 1].focus();
        }
      }, 0);
    }

    this.setupGrouping();
    this.analyticsService.SearchRowAdded();
  }

  getDefaultSearchRow() {
    var fssSearchRow = new FssSearchRow();
    fssSearchRow.joinOperators = this.joinOperators;
    fssSearchRow.fields = this.fields;
    fssSearchRow.operators = [];
    fssSearchRow.group = false;
    fssSearchRow.selectedJoinOperator = this.joinOperators[0].value;
    fssSearchRow.selectedField = "";
    fssSearchRow.selectedOperator = "";
    fssSearchRow.value = "";
    fssSearchRow.valueType = 'text';
    fssSearchRow.isValueHidden = false;
    fssSearchRow.rowId = this.rowId;
    fssSearchRow.time = "";
    fssSearchRow.valueFormControl = new FormControl();
    fssSearchRow.valueFormControlTime = new FormControl();
    fssSearchRow.fieldFormControl = new FormControl();
    fssSearchRow.filterFn = this.typeaheadFields;
    fssSearchRow.fieldFormControl = new FormControl('', [Validators.required, this.fssSearchValidatorService.FieldValidator(this.fields)]);
    fssSearchRow.fieldValue = "";
    return fssSearchRow;
  }

  onOperatorChanged(changedOperator: any) {
    var changedFieldRow = this.fssSearchHelperService.onOperatorChanged(changedOperator, this.operators, this.fssSearchRows);
  }

  onSearchRowDeleted(rowId: number) {
    var deleteRowIndex = this.fssSearchRows.findIndex(fsr => fsr.rowId === rowId);
    this.fssSearchRows.splice(deleteRowIndex, 1);
    //Reset rowGroupings on search row deletion
    this.rowGroupings = this.fssSearchGroupingService.resetRowGroupings(this.rowGroupings, deleteRowIndex);
    this.setupGrouping();
    this.analyticsService.SearchRowDeleted();
  }

  getAdvancedSearchResult() {
    this.onAdvancedSearchClicked.emit({ fssSearchRows: this.fssSearchRows, fields: this.fields, 
        operators: this.operators, rowGroupings: this.rowGroupings});
    }
  
  hideMessage() {
    this.messageType = "info";
    this.messageTitle = "";
    this.messageDesc = "";
    this.displayMessage = false;
    this.loginErrorDisplay = false;
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

  handleTokenExpiry() {
    this.showMessage("info", "Your Sign-in Token has Expired", "");
    this.loginErrorDisplay = true;
    this.displayLoader = false;
    this.analyticsService.tokenExpired();
  }

  onGroupClicked() {
    this.displaySearchResult = false;
    this.hideMessage();
    let rowIndexArray: Array<number> = [];
    for (var i = 0; i < this.fssSearchRows.length; i++) {
      if (this.fssSearchRows[i].group) {
        rowIndexArray.push(i);
      }
    }
    this.currentGroupStartIndex = rowIndexArray[0];
    this.currentGroupEndIndex = rowIndexArray[rowIndexArray.length - 1];

    if (this.isGroupAlreadyExist()) {
      this.showMessage("info", "A group already exists for selected clauses.", "A duplicate group cannot be created."
      );
    }
    else if (this.isGroupIntersectWithOther()) {
      this.showMessage("info", "Groups can not intersect each other.",
            "A group can only contain complete groups, they cannot contain a part of another group."
      );
    }
    else {
      this.addGrouping();
      this.setupGrouping();
    }
    this.analyticsService.GroupAdded();
  }

  isGroupAlreadyExist() {
    var grouping = this.rowGroupings.find(g => (g.startIndex === this.currentGroupStartIndex && g.endIndex === this.currentGroupEndIndex));
    return grouping !== undefined ? true : false;
  }

  isGroupIntersectWithOther() {
    return (this.rowGroupings.find(g => (this.currentGroupStartIndex < g.startIndex &&
      (this.currentGroupEndIndex >= g.startIndex &&
        this.currentGroupEndIndex < g.endIndex))) !== undefined) ||
      (this.rowGroupings.find(g => ((this.currentGroupStartIndex > g.startIndex &&
        this.currentGroupStartIndex <= g.endIndex) &&
        this.currentGroupEndIndex > g.endIndex)) !== undefined)
  }

  addGrouping() {
    this.rowGroupings.push({
      startIndex: this.currentGroupStartIndex,
      endIndex: this.currentGroupEndIndex
    });
  }

  setupGrouping() {
    this.uiGroupingDetails = this.fssSearchGroupingService.resetGroupingDetails(this.rowGroupings, this.fssSearchRows);
  }

  onGroupDeleted(grouping: any) {
    this.rowGroupings.splice(this.rowGroupings.findIndex(r =>
      r.startIndex === grouping.rowGrouping.startIndex &&
      r.endIndex === grouping.rowGrouping.endIndex), 1);
    this.setupGrouping();
    this.analyticsService.GroupDeleted();
  }

  filter(filterList: string[]) {
    return (text: string) => {
      // this.fieldFormControl.setValue(text)
      const filterResult = filterList
        .filter((field) => {
          return text === null || text.length < 1 || field.toLowerCase().indexOf(text.toLowerCase()) > -1;
        })
      return filterResult;
    };
  };

  onFieldChanged(changedField: any) {
    var changedFieldRow = this.fssSearchHelperService.onFieldChanged(changedField, this.fields, this.operators, this.fssSearchRows);
  }

  goToSearchEditor() {
    window.location.reload();
  }

  searchToAdvancedSearch(){
    this.ShowSimplifiedSearchClicked.emit();
  }
}
