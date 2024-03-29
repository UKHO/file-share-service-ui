import { Injectable } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';

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
  valueType :"time" | "text" | "date" | "email" | "password" | "tel" | "url";
  isValueHidden :boolean =false;
  rowId:number = 0;
  fieldFormControl: UntypedFormControl;
  filterFn: (filterTerm: string) => string[] | Observable<string[]>;
  time: string = "";
  valueFormControl: UntypedFormControl;
  valueFormControlTime: UntypedFormControl;
  fieldValue: string = "";
  dynamicClass: string = "";
}


@Injectable()
export abstract class IFssSearchService {
  /**
   * Return all above fields here
   */
  abstract getJoinOperators(): JoinOperator[];
  abstract getFields(batchAttributeResult: any): Field[];
  abstract getOperators(): Operator[];
}

export class RowGrouping {
  startIndex: number;
  endIndex: number;  
}

export class GroupingLevel {
  level: number;
  rowGroupings: RowGrouping[]=[];
}

export class UIGrouping {
  rowIndex: number;
  class: string;
  colspan: number;
  rowGrouping: RowGrouping;
}

export class UIGroupingDetails{
  maxGroupingLevel: number;
  uiGroupings: UIGrouping[];
}

export enum SearchType {
  SimplifiedSearch,
  AdvancedSearch  
}
