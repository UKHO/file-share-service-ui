import { Component, OnInit } from '@angular/core';

import { FssSearchService } from './../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow } from './../../core/models/fss-search-types';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';
import { getLocaleTimeFormat } from '@angular/common';

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
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private fileShareApiService: FileShareApiService) { }

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
    fssSearchRow.time = "";
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
    // check for null operators
    const operatorType = this.getOperatorType(changedFieldRow!.selectedOperator);
    if (operatorType == 'nullOperator') {
      changedFieldRow!.valueIsdisabled = true;
    }
    else {
      changedFieldRow!.valueIsdisabled = false;
    }

    changedFieldRow!.value = "";
    changedFieldRow!.time = "";
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
    var operatorType = this.getOperatorType(changedOperator.operatorValue);
    var changedFieldRow = this.getSearchRow(changedOperator.rowId);
    this.toggleValueInput(changedFieldRow!, operatorType);
  }

  getOperatorType(selectedOperator: string) {
    return this.operators.find(f => f.value === selectedOperator)?.type!;
  }

  toggleValueInput(changedFieldRow: FssSearchRow, operatorType: string) {
    if (operatorType === "nullOperator") {
      changedFieldRow!.valueIsdisabled = true;
      changedFieldRow!.value = "";
      changedFieldRow!.time = "";
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
          this.errorMessageTitle = "There is a problem with FileSize value field";
          this.errorMessageDescription = "Only enter numbers in the FileSize Value field. The Search will not run if characters are entered.";
          flag = false;
          break;
        }
      }
      const fieldDataType = this.getFieldDataType(this.fssSearchRows[rowId].selectedField);
      if (fieldDataType === 'date') {
        const operatorType = this.getOperatorType(this.fssSearchRows[rowId].selectedOperator);
        if (operatorType != 'nullOperator') {
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
        this.fileShareApiService.getSearchResult(filter).subscribe((res) => {
          if (res.length === 0) {
            console.log(res);
            this.handleResError();
          }
          else {
            this.handleSuccess(res);
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
  }

  handleSuccess(res: any) {
    if (res.count > 0) {
      this.searchResult = res;
      this.searchResult = Array.of(this.searchResult['entries']);
      this.displaySearchResult = true;
      this.hideMessage();
      this.displayLoader = false;
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
  }


}
