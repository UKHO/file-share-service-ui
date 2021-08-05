import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FssSearchService } from './../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow, RowGrouping, UIGroupingDetails } from './../../core/models/fss-search-types';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';
import { FssSearchGroupingService } from '../../core/services/fss-search-grouping.service';
import { FormControl, Validators } from '@angular/forms';


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
  userLocalTimeZone = this.getLocalTimeFormat();
  valueInputForm: FormControl;
  pageRecordCount: number = 10;
  searchResultTotal: number;
  pagingLinks: any = [];
  pages: number;
  currentPage: number = 0;
  paginatorLabel: string;
  currentGroupStartIndex: number=0;
  currentGroupEndIndex: number=0;
  rowGroupings: RowGrouping[]=[];
  uiGroupingDetails: UIGroupingDetails = new UIGroupingDetails();  
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private fileShareApiService: FileShareApiService, private elementRef: ElementRef, private fssSearchGroupingService: FssSearchGroupingService) { }

  ngOnInit(): void {
    this.joinOperators = this.fssSearchTypeService.getJoinOperators();
    this.operators = this.fssSearchTypeService.getOperators();
    /*Call attributes API to retrieve User attributes and send back to search service 
    to append to existing System attributes*/
    if (!localStorage['batchAttributes']) {
      this.fileShareApiService.getBatchAttributes().subscribe((batchAttributeResult) => {
        if (batchAttributeResult.length === 0) {
          this.handleResError();
        }
        else {
          console.log(batchAttributeResult);
          localStorage.setItem('batchAttributes', JSON.stringify(batchAttributeResult));
          this.setFields(batchAttributeResult);
        }
      });
    }
    else {
      var batchAttributeResult = JSON.parse(localStorage.getItem('batchAttributes')!);
      this.setFields(batchAttributeResult);
    }
  }

  getLocalTimeFormat() {
    return this.executeRegex(new Date().toTimeString(), /\(([^)]+)\)/);
  }

  executeRegex(valueField: any, regex: any) {
    var regExp = new RegExp(regex, "i");
    return regExp.exec(valueField)![1];
  }

  setFields(batchAttributeResult: any) {
    this.fields = this.fssSearchTypeService.getFields(batchAttributeResult);
    this.addSearchRow();
  }

  addSearchRow() {
    this.fssSearchRows.push(this.getDefaultSearchRow());
    this.rowId += 1;
    this.setupGrouping();
  }

  getDefaultSearchRow() {
    var fssSearchRow = new FssSearchRow();
    this.valueInputForm = new FormControl();
    fssSearchRow.joinOperators = this.joinOperators;
    fssSearchRow.fields = this.fields;
    fssSearchRow.operators = this.operators.filter(operator => operator.supportedDataTypes.includes("string"));
    fssSearchRow.group = false;
    fssSearchRow.selectedJoinOperator = this.joinOperators[0].value;
    fssSearchRow.selectedField = this.fields[0].value;
    fssSearchRow.selectedOperator = this.operators[0].value;
    fssSearchRow.value = '';
    fssSearchRow.valueType = 'text';
    fssSearchRow.isValueHidden = false;
    fssSearchRow.rowId = this.rowId;
    fssSearchRow.time = "";
    fssSearchRow.valueFormControl = this.valueInputForm
    fssSearchRow.valueFormControlTime = this.valueInputForm
    return fssSearchRow;
  }

  onFieldChanged(changedField: any) {
    // getFieldDataType
    var fieldDataType = this.getFieldDataType(changedField.fieldValue);
    // getFieldRow
    var changedFieldRow = this.getSearchRow(changedField.rowId);
    // SetDefaultValueFormControl based on fieldDataType
    this.setValueFormControl(fieldDataType, changedFieldRow!);
    // getFilteredOperators
    changedFieldRow!.operators = this.getFilteredOperators(fieldDataType);
    // getValueType
    changedFieldRow!.valueType = this.getValueType(fieldDataType);

    // setDefault
    if (!this.isOperatorExist(changedFieldRow!)) {
      changedFieldRow!.selectedOperator = "eq"
    }
    // check for null operators
    const operatorType = this.getOperatorType(changedFieldRow!.selectedOperator);
    this.toggleValueInput(changedFieldRow!, operatorType);

    changedFieldRow!.value = "";
    changedFieldRow!.time = "";
  }

  getFieldDataType(fieldValue: string) {
    return this.fields.find(f => f.value === fieldValue)?.dataType!;
  }

  getSearchRow(rowId: number) {
    return this.fssSearchRows.find(fsr => fsr.rowId === rowId);
  }

  setValueFormControl(fieldDataType: string, changedFieldRow: FssSearchRow) {
    if (fieldDataType === 'number') {
      changedFieldRow!.valueFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]);
    }
    else if (fieldDataType === 'date') {
      changedFieldRow!.valueFormControl = new FormControl(null, Validators.required);
      changedFieldRow!.valueFormControlTime = new FormControl(null, Validators.required);
    }
    else {
      changedFieldRow!.valueFormControl = new FormControl()
    }
    return changedFieldRow
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
    var operatorType = this.getOperatorType(changedOperator.operatorValue);
    var changedFieldRow = this.getSearchRow(changedOperator.rowId);
    this.toggleValueInput(changedFieldRow!, operatorType);
  }

  getOperatorType(selectedOperator: string) {
    return this.operators.find(f => f.value === selectedOperator)?.type!;
  }

  toggleValueInput(changedFieldRow: FssSearchRow, operatorType: string) {
    if (operatorType === "nullOperator") {
      changedFieldRow!.isValueHidden = true;
      changedFieldRow!.value = "";
      changedFieldRow!.time = "";
    }
    else {
      changedFieldRow!.isValueHidden = false;
    }
  }

  onSearchRowDeleted(rowId: number) {
    var deleteRowIndex = this.fssSearchRows.findIndex(fsr => fsr.rowId === rowId);    
    this.fssSearchRows.splice(deleteRowIndex, 1);
    //Reset rowGroupings on search row deletion
    this.rowGroupings = this.fssSearchGroupingService.resetRowGroupings(this.rowGroupings, deleteRowIndex);    
    this.setupGrouping();
  }

  validateValueFormControl() {
    for (let rowId = 0; rowId < this.fssSearchRows.length; rowId++) {
      const fieldDataType = this.getFieldDataType(this.fssSearchRows[rowId].selectedField);
      if (this.fssSearchRows[rowId].selectedField === 'FileSize') {
        if (this.fssSearchRows[rowId].value === "") {
          if (this.fssSearchRows[rowId].valueFormControl.touched === false) {
            this.fssSearchRows[rowId].valueFormControl.markAsTouched();
          }
        }
      }
      if (fieldDataType === 'date') {
        const operatorType = this.getOperatorType(this.fssSearchRows[rowId].selectedOperator);
        if (operatorType !== 'nullOperator') {
          if (this.fssSearchRows[rowId].value === "" || this.fssSearchRows[rowId].time === "") {
            if (this.fssSearchRows[rowId].valueFormControl.touched === false) {
              this.fssSearchRows[rowId].valueFormControl.markAsTouched();
            }
            if (this.fssSearchRows[rowId].valueFormControlTime.touched === false) {
              this.fssSearchRows[rowId].valueFormControlTime.markAsTouched();
            }
          }
        }
      }
    }
  }

  validateSearchInput() {
    var flag = true;
    this.validateValueFormControl()
    for (let rowId = 0; rowId < this.fssSearchRows.length; rowId++) {
      if (this.fssSearchRows[rowId].selectedField === 'FileSize') {
        var reg = new RegExp(/^\d+$/);
        var isNumber = reg.test(this.fssSearchRows[rowId].value);
        if (!isNumber) {
          this.errorMessageTitle = "There is a problem with FileSize value field";
          this.errorMessageDescription = "Only enter numbers in the FileSize Value field. The Search will not run if characters are entered.";
          flag = false;
          break;
        }
      }
      const fieldDataType = this.getFieldDataType(this.fssSearchRows[rowId].selectedField);
      if (fieldDataType === 'date') {
        const operatorType = this.getOperatorType(this.fssSearchRows[rowId].selectedOperator);
        if (operatorType !== 'nullOperator') {
          if (this.fssSearchRows[rowId].value === "" || this.fssSearchRows[rowId].time === "") {
            this.errorMessageTitle = "There is a problem with the Date and/or Time field";
            this.errorMessageDescription = "You must choose a date or time in these fields. Use your local time to search.";
            flag = false;
            break;
          }
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
          if (res.length === 0) {
            this.handleResError();
          }
          else {
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
          }

        },
          (error) => {
            this.handleErrMessage(error);
          }
        );
      }
    }
    else {
      this.searchResult = [];
      this.displaySearchResult = false;
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

  handleResError() {
    this.showMessage("info", "Login in progress", "Due to token expiry timeout we are trying to log you in again");
    this.displayLoader = false;
    this.searchResult = [];
    this.displaySearchResult = false;
  }

  private setPaginatorLabel(currentPage: number) {
    this.paginatorLabel = "Showing " + (((currentPage * this.pageRecordCount) - this.pageRecordCount) + 1) +
      "-" + (((currentPage * this.pageRecordCount) > this.searchResultTotal) ? this.searchResultTotal : (currentPage * this.pageRecordCount)) + " of " + this.searchResultTotal;
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

onGroupClicked(){

  this.displaySearchResult = false;
  this.hideMessage();
  let rowIndexArray:Array<number>=[];
  for(var i=0; i<this.fssSearchRows.length; i++){
    if(this.fssSearchRows[i].group){
      rowIndexArray.push(i);
    }
  } 
  this.currentGroupStartIndex= rowIndexArray[0]; 
  this.currentGroupEndIndex = rowIndexArray[rowIndexArray.length-1]; 

  if (this.isGroupAlreadyExist()){
      this.showMessage(
        "info",
        "A group already exists for selected clauses.",
        "A duplicate group cannot be created."
      );
  }
  else if(this.isGroupIntersectWithOther()){
      this.showMessage(
        "info",
        "Groups can not intersect each other.",
        "A group can only contain complete groups, they cannot contain a part of another group."
      );
  }
  else{       
      this.addGrouping();       
      this.setupGrouping();
  }
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

addGrouping(){
  this.rowGroupings.push({        
    startIndex: this.currentGroupStartIndex, 
    endIndex: this.currentGroupEndIndex
  });
}

setupGrouping(){
  this.uiGroupingDetails = this.fssSearchGroupingService.resetGroupingDetails(this.rowGroupings,this.fssSearchRows);
}

onGroupDeleted(grouping: any) { 
  this.rowGroupings.splice(this.rowGroupings.findIndex(r => 
    r.startIndex === grouping.rowGrouping.startIndex && 
    r.endIndex === grouping.rowGrouping.endIndex),1);  
  this.setupGrouping();  
}

} 