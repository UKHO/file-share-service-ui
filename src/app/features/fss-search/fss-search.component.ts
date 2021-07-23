import { Component, OnInit } from '@angular/core';

import { FssSearchService } from './../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow, RowGrouping, GroupingLevel, UIGrouping } from './../../core/models/fss-search-types';
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
  currentGroupStartIndex: number=0;
  currentGroupEndIndex: number=0;
  rowGroupings: RowGrouping[]=[];
  groupingLevels: GroupingLevel[]=[];
  uiGroupings: UIGrouping[] = [];
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private fileShareApiService: FileShareApiService) { }

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
    this.createUIGrouping();
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
      this.displaySearchResult = false;
      this.showMessage(
        "info",
        "No results can be found for this search",
        "Try again using different parameters in the search query."
      );
      this.displayLoader = false;
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

  onGroupClicked(){

    let rowIndexArray:Array<number>=[];
    for(var i=0; i<this.fssSearchRows.length; i++){
      if(this.fssSearchRows[i].group){
        rowIndexArray.push(i);
      }
    } 
    this.currentGroupStartIndex= rowIndexArray[0]; 
    this.currentGroupEndIndex = rowIndexArray[rowIndexArray.length-1]; 

    if (this.isGroupAlreadyExist()){
        alert("A group already exists for selected clauses.");
    }
    else if(this.isGroupIntersectWithOther()){
        alert("Groups can not intersect each other.");      
    }
    else{       
        this.AddGrouping();       
        this.createUIGrouping(); 
    }
    console.log(this.fssSearchRows);
    console.log(this.rowGroupings);
    console.log(this.groupingLevels);    
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

AddGrouping(){

  this.rowGroupings.push({        
    startIndex: this.currentGroupStartIndex, 
    endIndex: this.currentGroupEndIndex
  });
  
  if(this.groupingLevels.length == 0){   

    var groupingLevel = new GroupingLevel();
    groupingLevel.level = 1;
    groupingLevel.rowGroupings.push({startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex});
    this.groupingLevels.push(groupingLevel);

  }  
  else if(this.isOuterLevelGroup()){
        
    var matchedGroupingLevel = this.groupingLevels.filter(g=> g.rowGroupings.some( r => 
        r.startIndex >= this.currentGroupStartIndex && r.endIndex <= this.currentGroupEndIndex));

    var newLevel = new GroupingLevel();
    var matchedLevel = matchedGroupingLevel[matchedGroupingLevel.length-1];
    
    if(matchedLevel !== undefined){
      var currentlevel = this.groupingLevels.find(g => g.level === matchedLevel.level && g.rowGroupings.find(r=> 
        r.startIndex <= this.currentGroupStartIndex && r.endIndex >= this.currentGroupEndIndex));      
      
      if(currentlevel !== undefined) {
        newLevel = currentlevel;      
      }
      else {
        newLevel.level = matchedLevel.level + 1;
      }
    }
      
    var newLevelIndex = this.groupingLevels.findIndex(i => i.level === newLevel.level);           
    if(newLevelIndex !== -1){
      this.groupingLevels[newLevelIndex].rowGroupings.push({startIndex:this.currentGroupStartIndex, endIndex:this.currentGroupEndIndex});
    }
    else{
      newLevel.rowGroupings.push({startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex});
      this.groupingLevels.push(newLevel);
    }
  }     
  else if(this.isInnerLevelOfExistingGroup()) {
        alert("Inner grouping not supported.");
        this.rowGroupings.pop();
  }    
  else if(this.isInnerLevelGroup()){  

    var existingGroupingLevel = this.groupingLevels.filter(g => g.rowGroupings.some( r =>    
      (r.startIndex < this.currentGroupStartIndex && r.endIndex < this.currentGroupEndIndex) ||
      (r.startIndex > this.currentGroupStartIndex && r.endIndex > this.currentGroupEndIndex )));

      var existingLevel = existingGroupingLevel[0];
      var existingLevelIndex = this.groupingLevels.findIndex(i => i === existingLevel);        
      existingLevel.rowGroupings.push({startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex});

      this.groupingLevels[existingLevelIndex] = existingLevel;
  }    
}

isOuterLevelGroup(){
  var outerGroup =  this.groupingLevels.filter(g=> g.rowGroupings.some( 
    r => r.startIndex >= this.currentGroupStartIndex && r.endIndex <= this.currentGroupEndIndex));

  if (outerGroup.length>0){
    return true;
  }
  return false;
}

isInnerLevelOfExistingGroup(){
  var innerGroup = this.groupingLevels.filter(g => g.rowGroupings.find(
                  r => r.startIndex <= this.currentGroupStartIndex && r.endIndex >= this.currentGroupEndIndex));

  if (innerGroup.length>0){
    return true;
  }
  return false;
}

isInnerLevelGroup(){  
  var innerGroup = this.groupingLevels.find(g => g.rowGroupings.find( r => 
    ((r.startIndex < this.currentGroupStartIndex && r.endIndex < this.currentGroupEndIndex) && r.startIndex < this.currentGroupEndIndex) ||
    (r.startIndex > this.currentGroupStartIndex && r.endIndex > this.currentGroupEndIndex )));

    if (innerGroup !== undefined){
      return true;
    }
    return false;
}

createUIGrouping(){
  this.uiGroupings = [];

  if(this.groupingLevels.length > 0){
    var maxLevel = this.groupingLevels[this.groupingLevels.length-1].level;

    for(var i = 0; i < this.fssSearchRows.length; i++){  
      var j = maxLevel;

      while(j>=1){
        var groupingLevel = this.groupingLevels.find(g=>g.level === j);               
        var uiGrouping = new UIGrouping();
        uiGrouping.rowIndex = i;
        uiGrouping.class = this.getUIGroupClass(i, groupingLevel!);
        uiGrouping.colspan = this.getUIGroupingColspan(i, groupingLevel!);
        uiGrouping.rowGroupings = this.getUIRowGrouping(i, groupingLevel!);
        this.uiGroupings.push(uiGrouping);  
        
        j = j - uiGrouping.colspan; 
      }          
    }
  }
  console.log(this.uiGroupings);
}

getUIGroupClass(rowIndex: number, groupingLevel: GroupingLevel){
  var groupingClass = "";

  if(groupingLevel.rowGroupings.find(g=>g.startIndex == rowIndex)){
    groupingClass = "group group-start";
  }
  else if(groupingLevel.rowGroupings.find(g=>g.endIndex == rowIndex)){
    groupingClass = "group group-end";
  }
  else if(groupingLevel.rowGroupings.find(g=>g.startIndex < rowIndex && g.endIndex > rowIndex)){
    groupingClass = "group";
  }
  else{
    groupingClass = "no-group";
  }

  return groupingClass;
}

getUIGroupingColspan(rowIndex:number, groupingLevel: GroupingLevel) {
  var groupingLevels = this.groupingLevels.slice().reverse()
       .filter(gl => gl.level <= groupingLevel.level && gl.rowGroupings
       .some(g => rowIndex >= g.startIndex &&
        rowIndex <= g.endIndex ));

    if(groupingLevels.length > 1) {
      return groupingLevels[0].level - groupingLevels[1].level; 
    } 
    else if(groupingLevels.length === 1 && groupingLevels[0].level !== groupingLevel.level ) {
      return groupingLevels[0].level;
    }
    else {
      return groupingLevel.level;
    }      
}

getUIRowGrouping(rowIndex: number, groupingLevel:GroupingLevel){
  var rowGrouping = groupingLevel.rowGroupings.filter(r=>r.startIndex == rowIndex);
  return rowGrouping;
}

} 