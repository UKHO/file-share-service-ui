import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FssSearchService } from './../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow } from './../../core/models/fss-search-types';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';

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
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private fileShareApiService: FileShareApiService,private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.joinOperators = this.fssSearchTypeService.getJoinOperators();
    this.operators = this.fssSearchTypeService.getOperators();
    /*Call attributes API to retrieve User attributes and send back to search service 
    to append to existing System attributes*/
    this.fileShareApiService.getBatchAttributes().subscribe((batchAttributeResult) => {
      console.log(batchAttributeResult);
      this.fields = this.fssSearchTypeService.getFields(batchAttributeResult);
      this.addSearchRow();
    });
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
    return fssSearchRow;
  }

  onFieldChanged(changedField: any) {
    // getFieldDataType
    var fieldDataType = this.getFieldDataType(changedField.fieldValue);
    // getFieldRow
    var changedFieldRow = this.getSearchRow(changedField.rowId);
    // getFilteredOperators
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
          this.errorMessageDescription = "Incorrect value '" + this.fssSearchRows[rowId].value + "' on row " + (rowId+1);
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
        this.fileShareApiService.getSearchResult(filter).subscribe((res) => {
          this.handleSuccess(res)
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

  handleSuccess(res: any) {
    if (res.count > 0) {
      this.searchResult = res;
      this.searchResult = Array.of(this.searchResult['entries']);
      this.displaySearchResult = true;
      this.hideMessage();
      this.displayLoader = false;
    }
    else{
      this.searchResult = [];
      this.displayLoader = false;
      this.displaySearchResult = false;
      this.showMessage(
        "info",
        "No results can be found for this search",
        "Try again using different parameters in the search query."
      );     
    }
  }

  handleErrMessage(err: any){
    this.displayLoader = false;
    var errmsg="";
    if(err.error != undefined && err.error.total>0){    
        for(let i=0; i<err.error.errors.length; i++){
            errmsg += err.error.errors[i]['description']+'\n';
        }
        this.showMessage("warning","An exception occurred when processing this search",errmsg);
    }   
  }


}
