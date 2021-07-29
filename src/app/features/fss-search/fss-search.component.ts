import { Component, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FssSearchService } from './../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow } from './../../core/models/fss-search-types';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-fss-search',
  templateUrl: './fss-search.component.html',
  styleUrls: ['./fss-search.component.scss'],
  providers: [
    { provide: IFssSearchService, useClass: FssSearchService }
  ]
})
export class FssSearchComponent implements OnInit {

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
  pageRecordCount: number = 10;
  searchResultTotal: number;
  pagingLinks: any = [];
  pages: number;
  currentPage: number = 0;
  paginatorLabel: string;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private fileShareApiService: FileShareApiService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.joinOperators = this.fssSearchTypeService.getJoinOperators();
    this.operators = this.fssSearchTypeService.getOperators();
    /*Call attributes API to retrieve User attributes and send back to search service 
    to append to existing System attributes*/
    this.fileShareApiService.getBatchAttributes().subscribe((batchAttributeResult) => {
      this.fields = this.fssSearchTypeService.getFields(batchAttributeResult);
      for (let i = 0; i < this.fields.length; i++) {
        this.filterList.push(this.fields[i].text)
      }
      this.addSearchRow();
    });
    this.typeaheadFields = this.filter(this.filterList);
  }

  addSearchRow() {
    this.fssSearchRows.push(this.getDefaultSearchRow());
    this.rowId += 1;
  }

  getDefaultSearchRow() {
    var fssSearchRow = new FssSearchRow();
    fssSearchRow.joinOperators = this.joinOperators;
    fssSearchRow.fields = this.fields;
    fssSearchRow.operators = this.operators.filter(operator => operator.supportedDataTypes.includes("string"));
    fssSearchRow.group = false;
    fssSearchRow.selectedJoinOperator = this.joinOperators[0].value;
    fssSearchRow.selectedField = this.fields[0].value;
    fssSearchRow.selectedOperator = this.operators[0].value;
    fssSearchRow.value = '';
    fssSearchRow.valueType = 'text';
    fssSearchRow.valueIsdisabled = false;
    fssSearchRow.rowId = this.rowId;
    fssSearchRow.fieldFormControl = new FormControl();
    fssSearchRow.filterFn = this.typeaheadFields;
    return fssSearchRow;
  }

  getFieldDataType(fieldValue: string) {
    return this.fields.find(f => f.value === fieldValue)?.dataType!;
  }

  getSearchRow(rowId: number) {
    return this.fssSearchRows.find(fsr => fsr.rowId === rowId);
  }

  getFilteredOperators(fieldDataType: string) {
    return this.operators.filter(operator => operator.supportedDataTypes.includes(fieldDataType))
  }

  getValueType(fieldDataType: string) {
    var valueType: "time" | "text" | "date" | "email" | "password" | "tel" | "url" = "text";
    if (fieldDataType === "string" || fieldDataType === "attribute")
      valueType = "text";
    else if (fieldDataType === "number")
      valueType = "tel";
    else if (fieldDataType === "date")
      valueType = "date";

    return valueType
  }


  isOperatorExist(changedFieldRow: FssSearchRow) {
    var operator = changedFieldRow.operators.find(operator => operator.value === changedFieldRow?.selectedOperator)
    if (!operator) {
      return false;
    }
    else {
      return true
    }
  }

  onOperatorChanged(changedOperator: any) {
    var operatorType = this.getOperatorType(changedOperator);
    var changedFieldRow = this.getSearchRow(changedOperator.rowId);
    this.toggleValueInput(changedFieldRow!, operatorType);
  }

  getOperatorType(changedOperator: any) {
    return this.operators.find(f => f.value === changedOperator.operatorValue)?.type!;
  }

  toggleValueInput(changedFieldRow: FssSearchRow, operatorType: string) {
    if (operatorType === "nullOperator") {
      changedFieldRow!.valueIsdisabled = true;
      changedFieldRow!.value = "";
    }
    else {
      changedFieldRow!.valueIsdisabled = false;
    }
  }

  onSearchRowDeleted(rowId: number) {
    this.fssSearchRows.splice(this.fssSearchRows.findIndex(fsr => fsr.rowId === rowId), 1);
  }

  validateSearchInput() {
    var flag = true;

    for (let rowId = 0; rowId < this.fssSearchRows.length; rowId++) {
      if (this.fssSearchRows[rowId].selectedField === 'FileSize') {
        var reg = new RegExp(/^\d+$/);
        var isNumber = reg.test(this.fssSearchRows[rowId].value);
        if (!isNumber) {
          this.errorMessageTitle = "Please provide only Numbers against FileSize";
          this.errorMessageDescription = "Incorrect value '" + this.fssSearchRows[rowId].value + "' on row " + (rowId + 1);
          flag = false;
          break;
        }
      }
    }
    return flag;
  }

  getSearchResult() {
    if (this.validateSearchInput()) {
      this.displayLoader = true;
      var filter = this.fssSearchFilterService.getFilterExpression(this.fssSearchRows);
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
      this.showMessage(
        "warning",
        this.errorMessageTitle,
        this.errorMessageDescription);
    }
  }

  hideMessage() {
    this.messageType = "info";
    this.messageTitle = "";
    this.messageDesc = "";
    this.displayMessage = false;
  }

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayMessage = true;
    this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
    this.ukhoDialog.nativeElement.focus();
    if(this.displayLoader === false){
      window.scroll({
        top: 150,
        behavior: 'smooth' 
      });
   }
  }

  handleSuccess() {

    this.pagingLinks = this.searchResult['_Links'];
    this.searchResult = Array.of(this.searchResult['entries']);
    this.displaySearchResult = true;
    this.hideMessage();
    this.setPaginatorLabel(this.currentPage);
    this.displayLoader = false;
  }

  private setPaginatorLabel(currentPage: number) {
    this.paginatorLabel = "Showing " + (((currentPage * this.pageRecordCount) - this.pageRecordCount) + 1) +
      "-" + (((currentPage * this.pageRecordCount) > this.searchResultTotal) ? this.searchResultTotal : (currentPage * this.pageRecordCount)) + " of " + this.searchResultTotal;
  }

  handleErrMessage(err: any) {
    this.displayLoader = false;
    var errmsg = "";
    if (err.error != undefined && err.error.total > 0) {
      for (let i = 0; i < err.error.errors.length; i++) {
        errmsg += err.error.errors[i]['description'] + '\n';
      }
      this.showMessage("warning", "An exception occurred when processing this search", errmsg);
    }
  }
  pageChange(currentPage: number) {
    this.displayLoader = true;
    var paginatorAction = this.currentPage > currentPage ? "prev" : "next";
    this.currentPage = currentPage;
    if (paginatorAction === "next") {
      var nextPageLink = this.pagingLinks!.next!.href;
        this.fileShareApiService.getSearchResult(nextPageLink, true).subscribe((res) => {
        this.searchResult = res;
        this.handleSuccess()
      },
        (error) => {
          this.handleErrMessage(error);
        }
      );
    }
    else if (paginatorAction === "prev") {
      console.log(this.pagingLinks!);
      var previousPageLink = this.pagingLinks!.previous!.href;
      this.fileShareApiService.getSearchResult(previousPageLink, true).subscribe((res) => {
        this.searchResult = res;
        this.handleSuccess()
      },
        (error) => {
          this.handleErrMessage(error);
        }
      );
    }
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

  getFieldValue(fieldText: string) {
    const selectedFieldValue: any = this.fields.find(f => f.text === fieldText)?.value!;
    return selectedFieldValue;
  }

  onFieldChanged(fieldChanged: any) { 
    // getFieldRow
    var changedFieldRow = this.getSearchRow(fieldChanged.rowId);
    //getFieldValue
    var changedFieldValue = this.getFieldValue(fieldChanged.currentFieldValue);
    changedFieldRow!.selectedField = changedFieldValue;
    // getFieldDataType
    var fieldDataType = this.getFieldDataType(changedFieldValue);
    //getFilteredOperators
    changedFieldRow!.operators = this.getFilteredOperators(fieldDataType);
    // getValueType
    changedFieldRow!.valueType = this.getValueType(fieldDataType);
    // setDefault
    if (!this.isOperatorExist(changedFieldRow!)) {
      changedFieldRow!.selectedOperator = "eq"
    }
    changedFieldRow!.valueIsdisabled = false;
    changedFieldRow!.value = "";
  }
}
