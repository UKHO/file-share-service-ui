import { Injectable } from '@angular/core';

export interface JoinOperator {
    value: string;
    text: string;
}

export interface Field {
    value: string;
    text: string;
    type: string;
    dataType: string;
}

export interface Operator {
    value: string;
    text: string;
    type: string;
    supportedDataTypes: Array<string>; 
}

export class FssSearchRow {
  joinOperators: JoinOperator[] = [];
  fields: Field[] = [];
  operators: Operator[] = [];
  group: boolean = false;
  selectedJoinOperator: string = "";
  selectedField: string = "";
  selectedOperator: string = "";
  value: string = "";
  rowId:number = 0;
}


@Injectable()
export abstract class IFssSearchService {
  /**
   * Return all above fields here
   */
  abstract getJoinOperators(): JoinOperator[];
  abstract getFields(): Field[];
  abstract getOperators(): Operator[];
}