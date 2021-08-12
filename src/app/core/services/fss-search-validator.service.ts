import { Injectable } from '@angular/core';
import { Field, FssSearchRow, Operator } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssSearchValidatorService {
  errorMessageTitle = "";
  errorMessageDescription = "";

  constructor() { }

  validateSearchInput(fssSearchRows: FssSearchRow[], fields: Field[], operators: Operator[]) {
    var flag = true;
    this.errorMessageTitle = "";
    this.errorMessageDescription = "";
    this.validateValueFormControl(fssSearchRows, fields, operators)
    for (let rowId = 0; rowId < fssSearchRows.length; rowId++) {
      if (fssSearchRows[rowId].selectedField === 'FileSize') {
        var reg = new RegExp(/^\d+$/);
        var isNumber = reg.test(fssSearchRows[rowId].value);
        if (!isNumber) {
          this.errorMessageTitle = "There is a problem with FileSize value field";
          this.errorMessageDescription = "Only enter numbers in the FileSize Value field. The Search will not run if characters are entered.";
          flag = false;
          break;
        }
      }
      const fieldDataType = this.getFieldDataType(fssSearchRows[rowId].selectedField, fields);
      if (fieldDataType === 'date') {
        const operatorType = this.getOperatorType(fssSearchRows[rowId].selectedOperator, operators);
        if (operatorType !== 'nullOperator') {
          if (fssSearchRows[rowId].value === "" || fssSearchRows[rowId].time === "") {
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


  validateValueFormControl(fssSearchRows: FssSearchRow[], fields: Field[], operators: Operator[]) {
    for (let rowId = 0; rowId < fssSearchRows.length; rowId++) {
      const fieldDataType = this.getFieldDataType(fssSearchRows[rowId].selectedField, fields);
      if (fssSearchRows[rowId].selectedField === 'FileSize') {
        if (fssSearchRows[rowId].value === "") {
          if (fssSearchRows[rowId].valueFormControl.touched === false) {
            fssSearchRows[rowId].valueFormControl.markAsTouched();
          }
        }
      }
      if (fieldDataType === 'date') {
        const operatorType = this.getOperatorType(fssSearchRows[rowId].selectedOperator, operators);
        if (operatorType !== 'nullOperator') {
          if (fssSearchRows[rowId].value === "" || fssSearchRows[rowId].time === "") {
            if (fssSearchRows[rowId].valueFormControl.touched === false) {
              fssSearchRows[rowId].valueFormControl.markAsTouched();
            }
            if (fssSearchRows[rowId].valueFormControlTime.touched === false) {
              fssSearchRows[rowId].valueFormControlTime.markAsTouched();
            }
          }
        }
      }
    }
  }

  getOperatorType(selectedOperator: string, operators: Operator[]) {
    return operators.find(f => f.value === selectedOperator)?.type!;
  }

  getFieldDataType(fieldValue: string, fields: Field[]) {
    return fields.find(f => f.value === fieldValue)?.dataType!;
  }

}
