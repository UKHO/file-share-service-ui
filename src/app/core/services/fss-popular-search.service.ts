import { Injectable } from '@angular/core';
import { Field, FssSearchRow, Operator } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssPopularSearchService {

  constructor() { }

  getSearchQuery(fssSearchRows: FssSearchRow[], popularSearch: any, operators: Operator[]) {
    console.log("Before Value change", fssSearchRows, popularSearch);
    for (let rowIndex = 0; rowIndex < fssSearchRows.length; rowIndex++) {
      var popularSearchRow = popularSearch.rows[rowIndex];
      var fssSearchRow = fssSearchRows[rowIndex];
      fssSearchRow.selectedField = popularSearchRow.field;
      fssSearchRow.selectedJoinOperator = popularSearchRow.andOr;
      fssSearchRow.group = popularSearchRow.group;
      fssSearchRow.selectedOperator = popularSearchRow.operator;

      var fieldDataType = this.getFieldDataType(fssSearchRow.selectedField, fssSearchRow.fields);
      fssSearchRow.operators = this.getFilteredOperators(fieldDataType, operators);
      fssSearchRow.valueType = this.getValueType(fieldDataType);

      if (popularSearchRow.isDynamicValue) {
        popularSearchRow.value = popularSearchRow.value.replace(/^"(.*)"$/, '$1');
        var value = eval(popularSearchRow.value);
        this.getDateTime(value, fssSearchRow);
      }
      else {
        fssSearchRow.value = popularSearchRow.value;
      }
    }
    console.log("After Value change", fssSearchRows, popularSearch);
  }

  getDateBeforeNDays(nDays:number, startHour:any, startMinutes:any){
    var currentDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), startHour, startMinutes)
    var startDate: any = new Date(nDays*24*60*60*1000)
    var date = new Date(currentDate - startDate)
    return date;
  }

  getDateTime(value: any, fssSearchRow: FssSearchRow) {
    fssSearchRow.value = value.toLocaleDateString('fr-CA');
    fssSearchRow.time = value.toLocaleTimeString('en-GB',{hour:'2-digit', minute:'2-digit'});
  }

  getFieldDataType(fieldValue: string, fields: Field[]) {
    return fields.find(f => f.value === fieldValue)?.dataType!;
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

}
