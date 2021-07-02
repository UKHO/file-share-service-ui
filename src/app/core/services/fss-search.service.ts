import { Injectable } from '@angular/core';
import { JoinOperator, IFssSearchService, Field, Operator } from './../../core/models/fss-search-types';

@Injectable({
  providedIn: 'root'
})
export class FssSearchService implements IFssSearchService {
  userAttributes: Field[] = [];
  constructor() { }

  getJoinOperators() {
    const joinOperators: JoinOperator[] = [
      { value: 'and', text: 'And' },
      { value: 'or', text: 'Or' }
    ];

    return joinOperators;
  }

  getFields(batchAttributeResult: any) {
    const fields: Field[] = [
      { value: 'BusinessUnit', text: '@BusinessUnit', type: 'SystemAttribute', dataType: 'string' },
      { value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' },
      { value: 'MimeType', text: '@MimeType', type: 'SystemAttribute', dataType: 'string' },
      { value: 'FileSize', text: '@FileSize', type: 'SystemAttribute', dataType: 'number' },
      { value: 'ExpiryDate', text: '@BatchExpiryDate', type: 'SystemAttribute', dataType: 'date' },
      { value: 'BatchPublishedDate', text: '@BatchPublishedDate', type: 'SystemAttribute', dataType: 'date' }
    ];

    this.userAttributes = this.convertToArray(batchAttributeResult);
    return fields.concat(this.userAttributes);
  }

  getOperators() {
    const Operators: Operator[] = [
      { value: 'eq', text: '=' },
      { value: 'ne', text: '<>' },
      { value: 'eq null', text: '= null' },
      { value: 'ne null', text: '<> null' },
      { value: 'gt', text: '>' },
      { value: 'ge', text: '>=' },
      { value: 'lt', text: '<' },
      { value: 'le', text: '<=' },
      { value: 'startswith', text: 'StartsWith' },
      { value: 'not startswith', text: 'Not StartsWith' },
      { value: 'endswith', text: 'EndsWith' },
      { value: 'not endswith', text: 'Not EndsWith' },
      { value: 'contains', text: 'Contains' },
      { value: 'not contains', text: 'Not Contains' }
    ];

    return Operators;
  }

  convertToArray(batchAttributeResult: string | any[]) {

    for (let i = 0; i < batchAttributeResult.length; i++) {
      const batchAttributes: Field =
        { value: '$batch(' + batchAttributeResult[i] + ')', text: batchAttributeResult[i], type: 'UserAttribute', dataType: 'attribute' };
      this.userAttributes.push(batchAttributes);
    }
    return this.userAttributes;
  }

}
