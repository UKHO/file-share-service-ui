import { Injectable } from '@angular/core';
import { FssSearchRow } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssSearchFilterService {
  stringDataType: string = "string";
  attributeDataType: string = "attribute";
  numberDataType: string = "number";
  dateDataType: string = "date";
  typeOperator: string = "operator";
  nullOperatorType: string = "nullOperator";
  functionType: string = "function";

  constructor() { }

  getFilterExpression(fssSearchRows: FssSearchRow[]) {

    var filter = '';

    for (var i = 0; i < fssSearchRows.length; i++) {

      var fssSearchRow = fssSearchRows[i];
      // getFieldDataType
      const fieldDataType = this.getFieldDataType(fssSearchRow);
      // getOperatorType
      const operaterType = this.getOperatorType(fssSearchRow);

      //Append join operator from second search condition
      if (i != 0) {
        filter = filter.concat(' ', fssSearchRow.selectedJoinOperator, ' ');
      }
      if (fieldDataType === this.stringDataType || fieldDataType === this.attributeDataType) {
        if (operaterType === this.typeOperator) {
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " '", fssSearchRow.value, "'");
        }
        else if (operaterType === this.nullOperatorType) {
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator);
        }
        else if (operaterType === this.functionType) {
          filter = filter.concat(fssSearchRow.selectedOperator, "(", fssSearchRow.selectedField, ", '", fssSearchRow.value, "')");
        }
      }
      if (fieldDataType === this.numberDataType) {
        if (operaterType === this.typeOperator) {
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " ", fssSearchRow.value);
        }
      }
      if (fieldDataType === this.dateDataType) {
        if (operaterType === this.typeOperator) {
          const value = new Date(fssSearchRow.value + ' ' + fssSearchRow.time).toISOString();
          console.log(new Date(fssSearchRow.value + ' ' + fssSearchRow.time), value);
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " ", value);
        }
        else if (operaterType === this.nullOperatorType) {
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator);
        }
      }
    }
    return filter;
  }

  getFieldDataType(fssSearchRow: FssSearchRow) {
    const dataType = fssSearchRow.fields.find(f => f.value === fssSearchRow.selectedField)?.dataType!;
    return dataType
  }

  getOperatorType(fssSearchRow: FssSearchRow) {
    const operatorType = fssSearchRow.operators.find(o => o.value === fssSearchRow.selectedOperator)?.type!;
    return operatorType
  }

}
