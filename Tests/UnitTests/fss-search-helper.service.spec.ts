import { TestBed } from '@angular/core/testing';

import { FssSearchHelperService } from '../../src/app/core/services/fss-search-helper.service';
import { MockUserAttributeFields } from './fss-advanced-search.component.spec';
import { Field, FssSearchRow, Operator } from '../../src/app/core/models/fss-search-types';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';

describe('FssSearchHelperService', () => {
  let service: FssSearchHelperService;
  let searchService: FssSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssSearchHelperService);
    searchService = TestBed.inject(FssSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return field value "FileName" when field text is changed to "@FileName"', () => {
    expect(service.getFieldValue("@FileName", getFields())).toEqual('FileName');
  });

  test('should return false as endswith operator does not exists for BatchExpiryDate', () => {
    let searchRow: FssSearchRow//[];// = [];
    searchRow = createSearchRow(1, getFields(), getOperators(), 'AND', 'BatchExpiryDate', 'endswith', 'adds', 'date', false);
    expect(service.isOperatorExist(searchRow)).toEqual(false);
  });

  test('should return true as endswith operator exists for BatchExpiryDate', () => {
    let searchRow: FssSearchRow//[];// = [];
    searchRow = createSearchRow(1, getFields(), getOperators(), 'AND', 'BatchExpiryDate', 'eq', 'adds', 'date', false);
    expect(service.isOperatorExist(searchRow)).toEqual(true);
  });

  test('should return datatype as "attribute" when UserAttribute is passed', () => {
    expect(service.getFieldDataType('$batch(product)', searchService.getFields(MockUserAttributeFields()))).toEqual('attribute');
  });

  test('should return datatype as "string" when SystemAttribute FileName is passed', () => {
    expect(service.getFieldDataType('FileName', searchService.getFields(MockUserAttributeFields()))).toEqual('string');
  });

  test('should return second row based on rowid passed', () => {
    let searchRows: FssSearchRow[] = [];
    searchRows.push(createSearchRow(1, getFields(), getOperators(), 'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false));
    searchRows.push(createSearchRow(2, getFields(), getOperators(), 'OR', 'FileSize', 'le', 3000, 'tel', false));
    searchRows.push(createSearchRow(3, getFields(), getOperators(), 'AND', 'ExpiryDate', 'gt', '2021-12-31T13:00:00.000Z', 'date', false));
    var result = service.getSearchRow(2, searchRows);
    expect(result).toEqual(searchRows[1]);
  });

  test('should return filtered operators based on number datatype', () => {
    const expectedOperators: Operator[] = [
      { value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'ne', text: '<>', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'gt', text: '>', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'ge', text: '>=', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'lt', text: '<', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'le', text: '<=', type: 'operator', supportedDataTypes: ['number', 'date'] }];
    var result = service.getFilteredOperators('number', searchService.getOperators());
    expect(result).toEqual(expectedOperators);
  });

  test('should return value type text based on datatype string', () => {
    var expectedValueType = "text";
    var result = service.getValueType('string');
    expect(result).toEqual(expectedValueType);
  });

  test('should return operator type nullOperator based on operator value ne null', () => {
    var expectedOperatorType = "nullOperator";
    var changedOperator = { operatorValue: "ne null", rowId: 1 }
    var result = service.getOperatorType(changedOperator.operatorValue, searchService.getOperators());
    expect(result).toEqual(expectedOperatorType);
  });

  test('should hide Value input when nullOperator is selected in the row', () => {
    let searchRows: FssSearchRow[] = [];
    searchRows.push(createSearchRow(1, searchService.getFields(MockUserAttributeFields()), searchService.getOperators(), 'AND', 'FileSize', 'nullOperator', 'test', 'tel', true));
    service.toggleValueInput(searchRows[0], 'nullOperator');
    var result = searchRows[0].isValueHidden;
    expect(result).toBe(true);
  });

  test('should show Value input when other than nullOperator is selected in the row', () => {
    let searchRows: FssSearchRow[] = [];
    searchRows.push(createSearchRow(1, searchService.getFields(MockUserAttributeFields()), searchService.getOperators(), 'AND', 'FileSize', 'nullOperator', 'test', 'tel', true));
    service.toggleValueInput(searchRows[0], 'eq');
    var result = searchRows[0].isValueHidden;
    expect(result).toBe(false);
  });
});
export function getFields() {
  let fields: Field[] = [
    { value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' },
    { value: 'FileSize', text: '@FileSize', type: 'SystemAttribute', dataType: 'number' },
    { value: 'ExpiryDate', text: '@BatchExpiryDate', type: 'SystemAttribute', dataType: 'date' },
  ];
  return fields;
}

export function getOperators() {
  let operators: Operator[] = [
    { value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
    { value: 'gt', text: '>', type: 'operator', supportedDataTypes: ['number', 'date'] },
    { value: 'le', text: '<=', type: 'operator', supportedDataTypes: ['number', 'date'] },
    { value: 'ne null', text: '<> null', type: 'nullOperator', supportedDataTypes: ['date', 'attribute'] },
  ];
  return operators;
}

export function createSearchRow(rowId: number, fields: Field[], operators: Operator[], joinOperator: string, field: string, operator: string, value: any, valueType: "time" | "text" | "date" | "email" | "password" | "tel" | "url", isValueHidden: boolean) {
  var row = new FssSearchRow();
  row.rowId = rowId;
  row.fields = fields;
  row.operators = operators;
  row.selectedJoinOperator = joinOperator;
  row.selectedField = field;
  row.selectedOperator = operator;
  row.value = value;
  row.valueType = valueType;
  row.isValueHidden = isValueHidden;
  return row;
}