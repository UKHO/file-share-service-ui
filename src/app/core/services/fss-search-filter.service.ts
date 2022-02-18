import { Injectable } from '@angular/core';
import { FssSearchRow, RowGrouping } from '../models/fss-search-types';
import { FilterGroup } from '@ukho/design-system/filter/filter.types';

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

  getFilterExpression(fssSearchRows: FssSearchRow[], groupings: RowGrouping[]) {

    let filter = '';

    for (let rowIndex = 0; rowIndex < fssSearchRows.length; rowIndex++) {

      var fssSearchRow = fssSearchRows[rowIndex];
      var currentSearchRowJoinOperator = fssSearchRow.selectedJoinOperator;
      var currentSearchRowField = fssSearchRow.selectedField.replace(/'/g, "''");
      var currentSearchRowOperator = fssSearchRow.selectedOperator;
      var currentSearchRowValue = fssSearchRow.value.replace(/'/g, "''");

      // getFieldDataType
      const fieldDataType = this.getFieldDataType(fssSearchRow);
      // getOperatorType
      const operaterType = this.getOperatorType(fssSearchRow);

      //Append join operator from second search condition
      if (rowIndex != 0) {
        filter = filter.concat(' ', currentSearchRowJoinOperator, ' ');
      }
      //Append opening brackets for grouping query.
      var openingBracketCount = groupings.filter(g => g.startIndex === rowIndex).length;
      filter = filter.concat("(".repeat(openingBracketCount));

      if (fieldDataType === this.stringDataType || fieldDataType === this.attributeDataType) {
        if (operaterType === this.typeOperator) {
          filter = filter.concat(currentSearchRowField, " ", currentSearchRowOperator, " '", currentSearchRowValue, "'");
        }
        else if (operaterType === this.nullOperatorType) {
          filter = filter.concat(currentSearchRowField, " ", currentSearchRowOperator);
        }
        else if (operaterType === this.functionType) {
          filter = filter.concat(currentSearchRowOperator, "(", currentSearchRowField, ", '", currentSearchRowValue, "')");
        }
      }
      if (fieldDataType === this.numberDataType) {
        if (operaterType === this.typeOperator) {
          filter = filter.concat(currentSearchRowField, " ", currentSearchRowOperator, " ", currentSearchRowValue);
        }
      }
      if (fieldDataType === this.dateDataType) {
        if (operaterType === this.typeOperator) {
          const value = new Date(currentSearchRowValue + ' ' + fssSearchRow.time).toISOString();
          filter = filter.concat(currentSearchRowField, " ", currentSearchRowOperator, " ", value);
        }
        else if (operaterType === this.nullOperatorType) {
          filter = filter.concat(currentSearchRowField, " ", currentSearchRowOperator);
        }
      }
      //Append closing brackets for grouping query
      var closingBracketCount = groupings.filter(g => g.endIndex === rowIndex).length;
      filter = filter.concat(")".repeat(closingBracketCount));
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

  getFilterExpressionForSimplifiedSearch(fssSearchFilter: string): string {
    let searchKeywords = fssSearchFilter.split(" ");

    let filterExpression = "";
    for (let i in searchKeywords) {
      if (searchKeywords[i] !== "") {
        let searchKeyword = searchKeywords[i].replace(/'/g, "''");
        if (filterExpression === "")
          filterExpression = "$batchContains('" + searchKeyword + "')";
        else
          filterExpression = (filterExpression.concat(" OR ")).concat("$batchContains('" + searchKeyword + "')");
      }
    }
    return filterExpression;
  }

  getFilterExpressionForApplyFilter(fssFilterGroup: FilterGroup[]) {
    var filterExpressionForApplyFilter = "";
    fssFilterGroup.forEach(fg => {
      var filterExpressionPerFilterGroup = "";
      fg.items.forEach(item => {
        const formattedTitle = item.title.replace(/'/g, "''");
        if (item.selected === true) {
          if (filterExpressionPerFilterGroup === "") {
            filterExpressionPerFilterGroup = "$batchContains('" + formattedTitle + "')";
          }
          else {
            filterExpressionPerFilterGroup = filterExpressionPerFilterGroup.concat(" OR ").concat("$batchContains('" + formattedTitle + "')");
          }
        }
      });
      if (filterExpressionPerFilterGroup !== "") {
        if (filterExpressionForApplyFilter === "") {
          filterExpressionForApplyFilter = "(" + filterExpressionPerFilterGroup + ")";
        } else {
          filterExpressionForApplyFilter = filterExpressionForApplyFilter.concat(" AND ").concat("(" + filterExpressionPerFilterGroup + ")");
        }
      }
    });
  
    return filterExpressionForApplyFilter;
  }
}
