// import { Fieldoptions,FssSearchTypeService } from './../fss-search/fss-search-types';
import { Injectable } from '@angular/core';
import { JoinOperator,IFssSearchService,Field,Operator } from './../../core/models/fss-search-types';
@Injectable({
  providedIn: 'root'
})
export class FssSearchService implements IFssSearchService {

  constructor() { }

  getJoinOperators() {
    const joinOperators: JoinOperator[] = [
      { value: 'and',text: 'And'},
      { value: 'or',text: 'Or'}
    ];

    return joinOperators;
  }

  getFields() {
    const fields: Field[] = [
      {value: 'BusinessUnit',text: '@BusinessUnit', type: 'SystemAttribute', dataType: 'string'},
      {value: 'FileName',text: '@FileName', type: 'SystemAttribute', dataType: 'string'},
      {value: 'MimeType',text: '@MimeType', type: 'SystemAttribute', dataType: 'string'},
      {value: 'FileSize',text: '@FileSize', type: 'SystemAttribute', dataType: 'number'},
      {value: 'ExpiryDate',text: '@BatchExpiryDate', type: 'SystemAttribute', dataType: 'date'},
      {value: 'BatchPublishedDate',text: '@BatchPublishedDate', type: 'SystemAttribute', dataType: 'date'}
    ];

    return fields;
  }

  getOperators() {
    const Operators: Operator[] = [
      {value: 'eq',text: '=', 'type':'operators', 'supportedDataTypes':['string', 'number', 'date', 'attribute']},
      {value: 'ne',text: '<>', 'type':'operators', 'supportedDataTypes':['string', 'number', 'date', 'attribute']},
      {value: 'eq null',text: '= null', 'type':'nullOperator', 'supportedDataTypes':['attribute']},
      {value: 'ne null',text: '<> null', 'type':'nullOperator', 'supportedDataTypes':['attribute']},
      {value: 'gt',text: '>', 'type':'operator', 'supportedDataTypes':['number', 'date']},
      {value: 'ge',text: '>=', 'type':'operator', 'supportedDataTypes':['number', 'date']},
      {value: 'lt',text: '<', 'type':'operator', 'supportedDataTypes':['number', 'date']},
      {value: 'le',text: '<=', 'type':'operator', 'supportedDataTypes':['number', 'date']},
      {value: 'startswith',text: 'StartsWith', 'type':'function', 'supportedDataTypes':['string', 'attribute']},
      {value: 'not startswith',text: 'Not StartsWith', 'type':'function', 'supportedDataTypes':['string', 'attribute']},
      {value: 'endswith',text: 'EndsWith', 'type':'function', 'supportedDataTypes':['string', 'attribute']},
      {value: 'not endswith',text: 'Not EndsWith', 'type':'function', 'supportedDataTypes':['string', 'attribute']},
      {value: 'contains',text: 'Contains', 'type':'function', 'supportedDataTypes':['string', 'attribute']},
      {value: 'not contains',text: 'Not Contains', 'type':'function', 'supportedDataTypes':['string', 'attribute']}
    ];

    return Operators;
  }
}
