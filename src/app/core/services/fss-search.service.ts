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
      {value: '', text: 'Any', type: 'SystemAttribute', dataType: 'string' },
      {value: 'BusinessUnit',text: 'Business Unit', type: 'SystemAttribute', dataType: 'string'},
      {value: 'FileName',text: 'File Name', type: 'SystemAttribute', dataType: 'string'},
      {value: 'MimeType',text: 'Mime Type', type: 'SystemAttribute', dataType: 'string'},
      {value: 'FileSize',text: 'File Size (in bytes)', type: 'SystemAttribute', dataType: 'number'},
      {value: 'ExpiryDate',text: 'Batch Expiry Date', type: 'SystemAttribute', dataType: 'date'},
      {value: 'BatchPublishedDate',text: 'Batch Published Date', type: 'SystemAttribute', dataType: 'date'}
    ];

    this.userAttributes = this.refreshUserAttributes(batchAttributeResult);
    return fields.concat(this.userAttributes);
  }

  getOperators() {
    const Operators: Operator[] = [
      {value: 'eq',text: '=', type:'operator', supportedDataTypes:['string', 'number', 'date', 'attribute']},
      {value: 'ne',text: '<>', type:'operator', supportedDataTypes:['string', 'number', 'date', 'attribute']},
      {value: 'eq null',text: '= null', type:'nullOperator', supportedDataTypes:['date','attribute']},
      {value: 'ne null',text: '<> null', type:'nullOperator', supportedDataTypes:['date','attribute']},
      {value: 'gt',text: '>', type:'operator', supportedDataTypes:['number', 'date']},
      {value: 'ge',text: '>=', type:'operator', supportedDataTypes:['number', 'date']},
      {value: 'lt',text: '<', type:'operator', supportedDataTypes:['number', 'date']},
      {value: 'le',text: '<=', type:'operator', supportedDataTypes:['number', 'date']},
      {value: 'startswith',text: 'StartsWith', type:'function', supportedDataTypes:['string', 'attribute']},
      {value: 'not startswith',text: 'Not StartsWith', type:'function', supportedDataTypes:['string', 'attribute']},
      {value: 'endswith',text: 'EndsWith', type:'function', supportedDataTypes:['string', 'attribute']},
      {value: 'not endswith',text: 'Not EndsWith', type:'function', supportedDataTypes:['string', 'attribute']},
      {value: 'contains',text: 'Contains', type:'function', supportedDataTypes:['string', 'attribute']},
      {value: 'not contains',text: 'Not Contains', type:'function', supportedDataTypes:['string', 'attribute']}
    ];

    return Operators;
  }

  refreshUserAttributes(batchAttributeResult: string | any[]) {
    this.userAttributes = [];
    for (let i = 0; i < batchAttributeResult.length; i++) {
      const batchAttributes: Field =
        { value: '$batch(' + batchAttributeResult[i] + ')', text: batchAttributeResult[i], type: 'UserAttribute', dataType: 'attribute' };
      this.userAttributes.push(batchAttributes);
    }
    return this.userAttributes;
  }

}
