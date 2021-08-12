import { Component, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FssSearchService } from './../../core/services/fss-search.service';
import { Operator, IFssSearchService, Field, JoinOperator, FssSearchRow, RowGrouping, GroupingLevel, UIGrouping } from './../../core/models/fss-search-types';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';
import { Observable } from 'rxjs';
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
  filterList: string[] = new Array<string>();
  typeaheadFields: (filterTerm: string) => string[] | Observable<string[]>;
  selectedRow: number;
  userLocalTimeZone = this.getLocalTimeFormat();
  valueInputForm: FormControl;
  pageRecordCount: number = 10;
  searchResultTotal: number;
  pagingLinks: any = [];
  pages: number;
  currentPage: number = 0;
  paginatorLabel: string;
  currentGroupStartIndex: number = 0;
  currentGroupEndIndex: number = 0;
  rowGroupings: RowGrouping[] = [];
  groupingLevels: GroupingLevel[] = [];
  uiGroupings: UIGrouping[] = [];
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private fileShareApiService: FileShareApiService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.joinOperators = this.fssSearchTypeService.getJoinOperators();
    this.operators = this.fssSearchTypeService.getOperators();
   
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
    for (let i = 0; i < this.fields.length; i++) {
      this.filterList.push(this.fields[i].text)
    }
    this.typeaheadFields = this.filter(this.filterList);
    this.addSearchRow();
 }

  addSearchRow() {
    this.fssSearchRows.push(this.getDefaultSearchRow());
    this.rowId += 1;
    this.createUIGrouping();
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
    this.fssSearchRows.splice(this.fssSearchRows.findIndex(fsr => fsr.rowId === rowId), 1);
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
      var filter = this.fssSearchFilterService.getFilterExpression(this.fssSearchRows,this.rowGroupings);
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
    if (this.displayLoader === false) {
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
      this.showMessage(
        "info",
        "A group already exists for selected clauses.",
        "A duplicate group cannot be created."
      );
    }
    else if (this.isGroupIntersectWithOther()) {
      this.showMessage(
        "info",
        "Groups can not intersect each other.",
        "A group can only contain complete groups, they cannot contain a part of another group."
      );
    }
    else {
      this.AddGrouping();
      this.createUIGrouping();
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

  AddGrouping() {

    this.rowGroupings.push({
      startIndex: this.currentGroupStartIndex,
      endIndex: this.currentGroupEndIndex
    });

    if (this.groupingLevels.length == 0) {

      var groupingLevel = new GroupingLevel();
      groupingLevel.level = 1;
      groupingLevel.rowGroupings.push({ startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex });
      this.groupingLevels.push(groupingLevel);

    }
    else if (this.isOuterLevelGroup()) {

      var matchedGroupingLevel = this.groupingLevels.filter(g => g.rowGroupings.some(r =>
        r.startIndex >= this.currentGroupStartIndex && r.endIndex <= this.currentGroupEndIndex));

      var newLevel = new GroupingLevel();
      var matchedLevel = matchedGroupingLevel[matchedGroupingLevel.length - 1];

      if (matchedLevel !== undefined) {
        var currentlevel = this.groupingLevels.find(g => g.level === matchedLevel.level && g.rowGroupings.find(r =>
          r.startIndex <= this.currentGroupStartIndex && r.endIndex >= this.currentGroupEndIndex));

        if (currentlevel !== undefined) {
          newLevel = currentlevel;
        }
        else {
          newLevel.level = matchedLevel.level + 1;
        }
      }

      var newLevelIndex = this.groupingLevels.findIndex(i => i.level === newLevel.level);
      if (newLevelIndex !== -1) {
        this.groupingLevels[newLevelIndex].rowGroupings.push({ startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex });
      }
      else {
        newLevel.rowGroupings.push({ startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex });
        this.groupingLevels.push(newLevel);
      }
    }
    else if (this.isInnerLevelOfExistingGroup()) {
      this.showMessage(
        "info",
        "Adding an inner group to a group is not supported.",
        "To add an inner group, first remove the outer group, then add the inner group and re-add the outer group."
      );
      this.rowGroupings.pop();
    }
    else if (this.isInnerLevelGroup()) {

      var existingGroupingLevel = this.groupingLevels.filter(g => g.rowGroupings.some(r =>
        (r.startIndex < this.currentGroupStartIndex && r.endIndex < this.currentGroupEndIndex) ||
        (r.startIndex > this.currentGroupStartIndex && r.endIndex > this.currentGroupEndIndex)));

      var existingLevel = existingGroupingLevel[0];
      var existingLevelIndex = this.groupingLevels.findIndex(i => i === existingLevel);
      existingLevel.rowGroupings.push({ startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex });

      this.groupingLevels[existingLevelIndex] = existingLevel;
    }
  }

  isOuterLevelGroup() {
    var outerGroup = this.groupingLevels.filter(g => g.rowGroupings.some(
      r => r.startIndex >= this.currentGroupStartIndex && r.endIndex <= this.currentGroupEndIndex));

    if (outerGroup.length > 0) {
      return true;
    }
    return false;
  }

  isInnerLevelOfExistingGroup() {
    var innerGroup = this.groupingLevels.filter(g => g.rowGroupings.find(
      r => r.startIndex <= this.currentGroupStartIndex && r.endIndex >= this.currentGroupEndIndex));

    if (innerGroup.length > 0) {
      return true;
    }
    return false;
  }

  isInnerLevelGroup() {
    var innerGroup = this.groupingLevels.find(g => g.rowGroupings.find(r =>
      ((r.startIndex < this.currentGroupStartIndex && r.endIndex < this.currentGroupEndIndex) && r.startIndex < this.currentGroupEndIndex) ||
      (r.startIndex > this.currentGroupStartIndex && r.endIndex > this.currentGroupEndIndex)));

    if (innerGroup !== undefined) {
      return true;
    }
    return false;
  }

  createUIGrouping() {
    this.uiGroupings = [];

    if (this.groupingLevels.length > 0) {
      var maxLevel = this.groupingLevels[this.groupingLevels.length - 1].level;

      for (var i = 0; i < this.fssSearchRows.length; i++) {
        var j = maxLevel;

        while (j >= 1) {
          var groupingLevel = this.groupingLevels.find(g => g.level === j);
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
  }

  getUIGroupClass(rowIndex: number, groupingLevel: GroupingLevel) {
    var groupingClass = "";

    if (groupingLevel.rowGroupings.find(g => g.startIndex == rowIndex)) {
      groupingClass = "group group-start";
    }
    else if (groupingLevel.rowGroupings.find(g => g.endIndex == rowIndex)) {
      groupingClass = "group group-end";
    }
    else if (groupingLevel.rowGroupings.find(g => g.startIndex < rowIndex && g.endIndex > rowIndex)) {
      groupingClass = "group";
    }
    else {
      groupingClass = "no-group";
    }

    return groupingClass;
  }

  getUIGroupingColspan(rowIndex: number, groupingLevel: GroupingLevel) {
    var groupingLevels = this.groupingLevels.slice().reverse()
      .filter(gl => gl.level <= groupingLevel.level && gl.rowGroupings
        .some(g => rowIndex >= g.startIndex &&
          rowIndex <= g.endIndex));

    if (groupingLevels.length > 1) {
      return groupingLevels[0].level - groupingLevels[1].level;
    }
    else if (groupingLevels.length === 1 && groupingLevels[0].level !== groupingLevel.level) {
      return groupingLevels[0].level;
    }
    else {
      return groupingLevel.level;
    }
  }

  getUIRowGrouping(rowIndex: number, groupingLevel: GroupingLevel) {
    var rowGrouping = groupingLevel.rowGroupings.filter(r => r.startIndex == rowIndex);
    return rowGrouping;
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
    // SetDefaultValueFormControl based on fieldDataType
    this.setValueFormControl(fieldDataType, changedFieldRow!);
    //getFilteredOperators
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
    changedFieldRow!.time = "";
    changedFieldRow!.value = "";
  }
}