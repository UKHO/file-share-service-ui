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
      {value: 'BusinessUnit',text: '@BusinessUnit'},
      {value: 'FileName',text: '@FileName'},
      {value: 'MineType',text: '@MineType'},
      {value: 'FileSize',text: '@FileSize'},
      {value: 'ExpiryDate',text: '@BatchExpiryDate'},
      {value: 'BatchPublishedDate',text: '@BatchPublishedDate'}
    ];

    return fields;
  }

  getOperators() {
    const Operators: Operator[] = [
      {value: 'eq',text: '='},
      {value: 'ne',text: '<>'},
      {value: 'eq null',text: '= null'},
      {value: 'ne null',text: '<> null'},
      {value: 'gt',text: '>'},
      {value: 'ge',text: '>='},
      {value: 'lt',text: '<'},
      {value: 'le',text: '<='},
      {value: 'startswith',text: 'StartsWith'},
      {value: 'not startswith',text: 'Not StartsWith'},
      {value: 'endswith',text: 'EndsWith'},
      {value: 'not endswith',text: 'Not EndsWith'},
      {value: 'contains',text: 'Contains'},
      {value: 'not contains',text: 'Not Contains'}
    ];

    return Operators;
  }
}
