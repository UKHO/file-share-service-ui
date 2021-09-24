import { Injectable } from '@angular/core';
import { Field, FssSearchRow, Operator, RowGrouping } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssPopularSearchService {

  constructor() { }

  populateQueryEditor(fssSearchRows: FssSearchRow[], popularSearch: any, operators: Operator[], rowGroupings: RowGrouping[]) {
    console.log("Before Value change", fssSearchRows, popularSearch, rowGroupings);
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
        var value = eval(popularSearchRow.value);
        if (fieldDataType === 'date') {
          var dateTime = this.getDateTime(value);
          fssSearchRow.value = dateTime[0];
          fssSearchRow.time = dateTime[1];
        }
        else {
          fssSearchRow.value = value;
        }
      }
      else {
        fssSearchRow.value = popularSearchRow.value;
      }
    }
    if(popularSearch.rowGroupings !== undefined){
      for(let rowGroup = 0; rowGroup < popularSearch.rowGroupings.length; rowGroup++){
        rowGroupings.push({
          startIndex: popularSearch.rowGroupings[rowGroup]['startIndex'],
          endIndex: popularSearch.rowGroupings[rowGroup]['endIndex']
        });
      }
    }
    console.log("After Value change", fssSearchRows, popularSearch, rowGroupings);
  }

  getDateBeforeNDays(nDays:number, startHour:any, startMinutes:any){
    var currentDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), startHour, startMinutes)
    var startDate: any = new Date(nDays*24*60*60*1000)
    var date = new Date(currentDate - startDate)
    return date;
  }
 
  getWeekNumber(date: any) {
      date = new Date(date.valueOf());
      var dayNumber = (date.getDay() + 3) % 7;
      date.setDate(date.getDate() - dayNumber);
      var firstThursday = date.valueOf();
      date.setMonth(0, 1);
      if (date.getDay() !== 4)
        {
       date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
         }
      var weekNumber = 1 + Math.ceil((firstThursday - date) / 604800000);    
      return weekNumber;
  }

  getYear(date:any){
    date = new Date(date.valueOf());
    var year = date.getFullYear();
    var weekNumber = this.getWeekNumber(date);
    if(date.getMonth() == 0 && weekNumber >= 52){
      year = year - 1;
    }
    return year;
  }

  getDateTime(value: any) {
    var date = value.toLocaleDateString('fr-CA');
    var time = value.toLocaleTimeString('en-GB',{hour:'2-digit', minute:'2-digit'});
    return [date, time]
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
