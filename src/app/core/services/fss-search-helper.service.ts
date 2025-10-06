import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Field, FssSearchRow, Operator } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssSearchHelperService {

  constructor() { }

  onFieldChanged(changedField:any, fields: Field[], operators: Operator[], fssSearchRows: FssSearchRow[]){
    // getFieldDataType
    console.log('Helper onFieldChange'); //Rhz
    console.log('Changed Field', changedField); //Rhz
    console.log('Fields', fields); //Rhz
    var changedFieldRow = this.getSearchRow(changedField.rowId, fssSearchRows);
    var changedFieldValue = this.getFieldValue(changedField.currentFieldValue, fields);
    changedFieldRow!.selectedField = changedFieldValue;

    changedFieldRow!.value = "";
    console.log('Changed Field Value', changedFieldValue); //Rhz
    var fieldDataType = this.getFieldDataType(changedFieldValue, fields);
    // getFieldRow
    console.log('Change Field Row', changedFieldRow!); //Rhz
    if(fieldDataType && changedFieldRow!.value){
      return changedFieldRow;
    }
    // SetDefaultValueFormControl based on fieldDataType
    this.setValueFormControl(fieldDataType, changedFieldRow!);
    console.log('About to access filter operators'); //Rhz
    console.log('Field Type', fieldDataType); //Rhz
    console.log('Operators', operators); //Rhz
    // getFilteredOperators
    changedFieldRow!.operators = this.getFilteredOperators(fieldDataType, operators);
    console.log('Filter operators: ', changedFieldRow!.operators  ); //Rhz
    // getValueType
    changedFieldRow!.valueType = this.getValueType(fieldDataType);
    console.log('Filter value: ', changedFieldRow!.valueType  ); //Rhz

    // setDefault
    if (!this.isOperatorExist(changedFieldRow!)) {
      changedFieldRow!.selectedOperator = "eq"
    }
    // check for null operators
    const operatorType = this.getOperatorType(changedFieldRow!.selectedOperator, operators);
    this.toggleValueInput(changedFieldRow!, operatorType);

    changedFieldRow!.value = "";
    changedFieldRow!.time = "";

    return changedFieldRow
  }

  getFieldDataType(fieldValue: string, fields:Field[]) {
    return fields.find(f => f.value === fieldValue)?.dataType!;
  }

  getSearchRow(rowId: number, fssSearchRows: FssSearchRow[]) {
    return fssSearchRows.find(fsr => fsr.rowId === rowId);
  }

  getFieldValue(fieldText: string, fields: Field[]) {
    console.log('Get Field Value'); //Rhz
    console.log('Field Text', fieldText); //Rhz
    let testResult: any = fields.find(f => f.text === fieldText);
    console.log('Test Result', testResult); //Rhz
    const selectedFieldValue: any = fields.find(f => f.text === fieldText)?.value!;
    //const selectedFieldValue: any = "FileName";
    console.log('Selected Field Value', selectedFieldValue); //Rhz
    return selectedFieldValue;
  }

  setValueFormControl(fieldDataType: string, changedFieldRow: FssSearchRow) {
    if (fieldDataType === 'number') {
      changedFieldRow!.valueFormControl = new UntypedFormControl('', [Validators.required, Validators.pattern(/^\d+$/)]);
    }
    else if (fieldDataType === 'date') {
      changedFieldRow!.valueFormControl = new UntypedFormControl(null, Validators.required);
      changedFieldRow!.valueFormControlTime = new UntypedFormControl(null, Validators.required);
      changedFieldRow!.dynamicClass = 'dateTime'
    }
    else {
      changedFieldRow!.valueFormControl = new UntypedFormControl()
      changedFieldRow!.dynamicClass = '' 
    }
    return changedFieldRow
  }

  getFilteredOperators(fieldDataType: string, operators: Operator[]) {
    return operators.filter(operator => operator.supportedDataTypes.includes(fieldDataType))
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

  getOperatorType(selectedOperator: string, operators: Operator[]) {
    return operators.find(f => f.value === selectedOperator)?.type!;
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

  onOperatorChanged(changedOperator: any, operators: Operator[], fssSearchRows: FssSearchRow[]) {
    var operatorType = this.getOperatorType(changedOperator.operatorValue, operators);
    var changedFieldRow = this.getSearchRow(changedOperator.rowId, fssSearchRows);
    this.toggleValueInput(changedFieldRow!, operatorType);

    return changedFieldRow;
  }

}
