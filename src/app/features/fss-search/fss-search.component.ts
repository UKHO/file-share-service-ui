import { FssSearchService } from './../../core/services/fss-search.service';
import { Component, OnInit } from '@angular/core';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow } from './../../core/models/fss-search-types';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';
import { createFalse } from 'typescript';


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
  searchButtonText: string = "Search";
  displayMessage: boolean = false;
  displaySearchResult: Boolean = false;
  displayLoader: boolean = false;

  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private searchResultService: FileShareApiService) { }

  ngOnInit(): void {
    this.joinOperators = this.fssSearchTypeService.getJoinOperators();
    this.fields = this.fssSearchTypeService.getFields();
    this.operators = this.fssSearchTypeService.getOperators();
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
    return fssSearchRow;
  }

  onFieldChanged(changedField: any) {
    var fieldDataType = this.fields.find(f => f.value === changedField.fieldValue)?.dataType!;
    var changedFieldRow = this.fssSearchRows.find(fsr => fsr.rowId === changedField.rowId);
    changedFieldRow!.operators = this.operators.filter(operator => operator.supportedDataTypes.includes(fieldDataType));
    
    if (fieldDataType === "string" || fieldDataType === "attribute")
      changedFieldRow!.valueType = "text";
    else if (fieldDataType === "number")
      changedFieldRow!.valueType = "tel";
    else if (fieldDataType === "date")
      changedFieldRow!.valueType = "date";
    // if(!this.contains(changedFieldRow?.operators, changedFieldRow?.selectedOperator)){
    //   changedFieldRow!.selectedOperator = "eq";
    // }
    if(!changedFieldRow?.operators.find(operator => operator.value === changedFieldRow?.selectedOperator)){
      changedFieldRow!.selectedOperator = "eq";
    }
    changedFieldRow!.valueIsdisabled = false;
    changedFieldRow!.value = "";
  }

  // contains(operators:any, selectedOperator:any){
  //   for(let i=0; i< operators.length; i++){
  //     if(operators[i].value === selectedOperator){
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  onOperatorChanged(changedOperator: any) {
    var operatorType = this.operators.find(f => f.value === changedOperator.operatorValue)?.type!;
    var changedFieldRow = this.fssSearchRows.find(fsr => fsr.rowId === changedOperator.rowId);
    if(operatorType === "nullOperator")
    {
      changedFieldRow!.valueIsdisabled = true;
      changedFieldRow!.value = "";
    }
   else{
    changedFieldRow!.valueIsdisabled = false;
   }
    
  }

  onSearchRowDeleted(rowId: number) {
    this.fssSearchRows.splice(this.fssSearchRows.findIndex(fsr => fsr.rowId === rowId), 1);
  }

  getSearchResult() {
    this.searchButtonText = "Refine Search";
    this.displayLoader = true;
    var filter = this.fssSearchFilterService.getFilterExpression(this.fssSearchRows);
    console.log(filter);
    if (filter != null) {
      this.searchResult = [];
      this.searchResultService.getSearchResult(filter).subscribe((res) => {
        this.handleSuccess(res)
      },
        (error) => {
          this.handleErrMessage(error);
        }
      );
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
    for (let i = 0; i < err.error.errors.length; i++) {
      errmsg += err.error.errors[i]['description'] + '\n';
    }
    this.showMessage("warning", "An exception occurred when processing this search", errmsg);
  }


}
