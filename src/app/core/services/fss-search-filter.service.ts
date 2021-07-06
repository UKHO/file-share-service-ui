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
  nulloperatorType: string = "nullOperator";
  functionType: string = "function";

  constructor() { }

  getFilterExpression(fssSearchRows: FssSearchRow[]) {
    
    var filter='';

    for(var i=0; i < fssSearchRows.length; i++) {

      var fssSearchRow = fssSearchRows[i];
      // getFieldDataType
      const dataType = this.getFieldDataType(fssSearchRow);
      // getOperatorType
      const operaterType = this.getOperatorType(fssSearchRow);
      // dataType, OperatorType
      console.log(dataType, operaterType);
      // operaterType Func. 
      // Operatorvalue(SelectedField,value)

      //Append join operator from second search condition
      if(i != 0) {
        filter = filter.concat(' ',fssSearchRow.selectedJoinOperator, ' ');        
      }
      if(dataType === this.stringDataType || dataType === this.attributeDataType){
        if(operaterType === this.typeOperator){
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " '", fssSearchRow.value, "'");
        }
        else if(operaterType === this.nulloperatorType){
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator);
        }
        else if(operaterType === this.functionType){
          filter = filter.concat(fssSearchRow.selectedOperator, "(", fssSearchRow.selectedField, ", '", fssSearchRow.value, "')");
        }
      }
      if(dataType === this.numberDataType){
        if(operaterType === this.typeOperator){
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " ", fssSearchRow.value);
        }
      }
      if(dataType === this.dateDataType){
        const value = new Date(fssSearchRow.value).toISOString();
        if(operaterType === this.typeOperator){
          filter = filter.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " ", value);
        }
      }
      console.log("Before Completion",filter);
      // //Get system attribute filter expression
      // filter += this.getSystemAttributeFilterExpression(fssSearchRow);      
    }
    console.log("After completion",filter);
    return filter;
  }

  getFieldDataType(fssSearchRow: FssSearchRow){
    console.log(fssSearchRow);
    const dataType = fssSearchRow.fields.find(f => f.value === fssSearchRow.selectedField)?.dataType!;
    return dataType
  }

  getOperatorType(fssSearchRow: FssSearchRow){
    console.log(fssSearchRow);
    const operatorType = fssSearchRow.operators.find(o => o.value === fssSearchRow.selectedOperator)?.type!;
    return operatorType
  }

  getSystemAttributeFilterExpression(fssSearchRow: FssSearchRow) {

    var filterExpression='';

    switch(fssSearchRow.selectedField) {
      //For number and date field
      case 'FileSize':
      case 'ExpiryDate':
      case 'BatchPublishedDate':
        filterExpression = filterExpression.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " ", fssSearchRow.value);
        break;
      //For all other fields
      default:
        filterExpression = filterExpression.concat(fssSearchRow.selectedField, " ", fssSearchRow.selectedOperator, " '", fssSearchRow.value, "'");
        break;      
    }
    return filterExpression;   
  } 
}
