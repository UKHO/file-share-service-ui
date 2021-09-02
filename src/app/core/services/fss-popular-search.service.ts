import { Injectable } from '@angular/core';
import { Field, FssSearchRow, Operator } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssPopularSearchService {

  constructor() { }

  getSearchQuery(fssSearchRows: FssSearchRow[], popularSearch: any, operators: Operator[]) {
    console.log("Before Value change", fssSearchRows, popularSearch);
    for (let i = 0; i < fssSearchRows.length; i++) {
      var popularSearchRow = popularSearch.rows[i]
      fssSearchRows[i].selectedField = popularSearchRow.field;
      fssSearchRows[i].selectedJoinOperator = popularSearchRow.andOr;
      fssSearchRows[i].group = popularSearchRow.group;
      fssSearchRows[i].selectedOperator = popularSearchRow.operator;
      var fieldDataType = this.getFieldDataType(fssSearchRows[i].selectedField, fssSearchRows[i].fields);
      fssSearchRows[i].operators = this.getFilteredOperators(fieldDataType, operators);
      if (popularSearchRow.isDynamicValue) {
        popularSearchRow.value = popularSearchRow.value.replace(/^"(.*)"$/, '$1');
        var value = eval(popularSearchRow.value)
        var dateTime = this.getDateTime(value);
        fssSearchRows[i].value = dateTime[0];
        fssSearchRows[i].time = dateTime[1];
      }
      else {
        fssSearchRows[i].value = popularSearchRow.value;
      }
      fssSearchRows[i].valueType = this.getValueType(fieldDataType);
    }
    console.log("After Value change", fssSearchRows, popularSearch);
  }

  getDateTime(value: any) {
    var month = value.getMonth() + 1;
    var getDate = value.getDate();
    var hours = value.getHours();
    var minutes = value.getMinutes();
    month = (month < 10) ? ("0" + month) : month;
    getDate = (getDate < 10) ? ("0" + getDate) : getDate;
    hours = (hours < 10) ? ("0" + hours) : hours;
    minutes = (minutes < 10) ? ("0" + minutes) : minutes;
    var date = value.getFullYear()+ '-' + month + '-' + getDate;
    var time = hours + ':' + minutes;
    return [date, time];
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
