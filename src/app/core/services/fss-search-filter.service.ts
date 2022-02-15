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

  getFilterExpression(fssSearchRows: FssSearchRow[],groupings : RowGrouping[]) {
    
    var filter='';

    for(var rowIndex=0; rowIndex < fssSearchRows.length; rowIndex++) {

      var fssSearchRow = fssSearchRows[rowIndex];
      // getFieldDataType
      const fieldDataType = this.getFieldDataType(fssSearchRow);
      // getOperatorType
      const operaterType = this.getOperatorType(fssSearchRow);

      //Append join operator from second search condition
      if(rowIndex != 0) {
        filter = filter.concat(' ',fssSearchRow.selectedJoinOperator, ' ');        
      }
      //Append opening brackets for grouping query.
      var openingBracketCount = groupings.filter(g=>g.startIndex === rowIndex).length;
      filter = filter.concat("(".repeat(openingBracketCount));
        
      if(fieldDataType === this.stringDataType || fieldDataType === this.attributeDataType){
        if(operaterType === this.typeOperator){
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
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " ", value);
        }
        else if (operaterType === this.nullOperatorType) {
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator);
        }
      }
      //Append closing brackets for grouping query
      var closingBracketCount = groupings.filter(g=>g.endIndex === rowIndex).length;
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

  getFilterExpressionForApplyFilter(fssFilterItem: FilterGroup[]){
   var MainFilter = "$batchContains('" + "avcs" + "')";
   var FilterExpressionForApplyFilter = "";
    for(var i=0; i < fssFilterItem.length; i++) {
      var FilterExpressionForItems = "";
      for(var j=0; j < fssFilterItem[i].items.length; j++){
          if(fssFilterItem[i].items[j].selected === true){
            if (FilterExpressionForItems === ""){
              FilterExpressionForItems = "$batchContains('" + fssFilterItem[i].items[j].title + "')";
            }
            else{
              FilterExpressionForItems = (FilterExpressionForItems.concat(" OR ")).concat("$batchContains('" + fssFilterItem[i].items[j].title + "')");
          }
        }
        
      }
      if(FilterExpressionForItems != ""){
        FilterExpressionForApplyFilter = (FilterExpressionForApplyFilter.concat(" AND ")).concat("(" + FilterExpressionForItems + ")" );
      }
    }
    console.log(FilterExpressionForApplyFilter);
    // $batchContains('avcs') AND (($batchContains('AVCS') OR $batchContains('ADP')) AND ($batchContains('DVD') OR $batchContains('CD')))    
    return FilterExpressionForApplyFilter;
  }

}
