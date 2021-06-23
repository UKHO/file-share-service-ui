import { Injectable } from '@angular/core';
import { FssSearchRow } from '../models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssSearchFilterService {

  constructor() { }

  getFilterExpression(fssSearchRows: FssSearchRow[]) {
    
    var filter='';

    for(var i=0; i < fssSearchRows.length; i++) {

      var fssSearchRow = fssSearchRows[i];

      //Append join operator from second search condition
      if(i != 0) {
        filter = filter.concat(' ',fssSearchRow.selectedJoinOperator, ' ');        
      }

      //Get system attribute filter expression
      filter += this.getSystemAttributeFilterExpression(fssSearchRow);      
    }

    return filter;
  }

  getSystemAttributeFilterExpression(fssSearchRow: FssSearchRow) {

    var filterExpression='';

    switch(fssSearchRow.selectedField) {
      //For integer field
      case 'FileSize':
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
