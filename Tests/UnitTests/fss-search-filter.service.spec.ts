import { TestBed } from '@angular/core/testing';
import { Field, Operator, FssSearchRow, IFssSearchService } from '../../src/app/core/models/fss-search-types';

import { FssSearchFilterService } from '../../src/app/core/services/fss-search-filter.service';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';

describe('FssSearchFilterService', () => {
  let service: FssSearchFilterService;
  let searchService: IFssSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    searchService = TestBed.inject(FssSearchService);
    service = TestBed.inject(FssSearchFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for single searcg criteria
  test('should create valid filter expression for single search criteria', () => {
    let searchRows: FssSearchRow[] = [];
    let fields: Field[] = [];
    let operators: Operator[] = [];
    fields.push({ value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' });
    operators.push({ value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] });
    searchRows.push(createSearchRow(1, fields, operators, 'AND', 'FileName', 'eq', 'Test.txt', 'text', false, ""));
    var filter = service.getFilterExpression(searchRows);

    expect(filter).toBe("FileName eq 'Test.txt'");
  });

  //Test for multiple search criteria
  test('should create valid filter expression for multiple search criteria', () => {
    let searchRows: FssSearchRow[] = [];
    let fields: Field[] = [
      { value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' },
      { value: 'FileSize', text: '@FileSize', type: 'SystemAttribute', dataType: 'number' },
      { value: 'ExpiryDate', text: '@BatchExpiryDate', type: 'SystemAttribute', dataType: 'date' },
    ];
    let operators: Operator[] = [
      { value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'gt', text: '>', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'le', text: '<=', type: 'operator', supportedDataTypes: ['number', 'date'] }
    ];
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31', 'date', false, "12:00"));

    var filter = service.getFilterExpression(searchRows);

    expect(filter).toBe("FileName eq 'TestReport.pdf' OR FileSize le 3000 AND ExpiryDate gt 2021-12-31T12:00:00.000Z");
  });
});

export function createSearchRow(rowId: number, fields: Field[], operators: Operator[], joinOperator: string, field: string, operator: string, value: any, valueType: "time" | "text" | "date" | "email" | "password" | "tel" | "url", isValueHidden: boolean,time: string) {
  var row = new FssSearchRow();
  row.rowId = rowId;
  row.fields = fields,
  row.operators = operators;
  row.selectedJoinOperator = joinOperator;
  row.selectedField = field;
  row.selectedOperator = operator;
  row.value = value;
  row.valueType = valueType;
  row.isValueHidden = isValueHidden;
  row.time = time;
  return row;
}



