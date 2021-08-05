import { TestBed } from '@angular/core/testing';
import { FssSearchGroupingService } from '../../src/app/core/services/fss-search-grouping.service';
import { Field, Operator, FssSearchRow, IFssSearchService, RowGrouping, GroupingLevel, UIGrouping } from '../../src/app/core/models/fss-search-types';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';
import { fssConfiguration } from 'appConfig';

describe('FssSearchGroupingService', () => {
  let service: FssSearchGroupingService;
  let searchService: IFssSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    searchService = TestBed.inject(FssSearchService);
    service = TestBed.inject(FssSearchGroupingService);
  });

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

  it('FssSearchGroupingService should be created', () => {
    expect(service).toBeTruthy();
  });

  //Test for grouping levels
  test('should create valid grouping levels for selected groupings', () => {
    let searchRows: FssSearchRow[] = [];
    let groupings: RowGrouping[] = [];    
    
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31', 'date', false, "12:00"));

    groupings.push({startIndex: 1, endIndex: 2});
    groupings.push({startIndex: 0, endIndex: 2}); 

    var groupingDetails = service.resetGroupingDetails(groupings,searchRows);

    expect(groupingDetails.maxGroupingLevel).toEqual(2);
  });
    
  //Test for ui groupings
  test('should create valid ui groupings for selected groupings & grouping levels', () => {
    let searchRows: FssSearchRow[] = [];
    let groupings: RowGrouping[] = [];
    let groupingLevels: GroupingLevel[] = [];
    let expectedUiGroupings: UIGrouping[] = [];
 
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31T13:00:00.000Z', 'date', false, "12:00"));

    groupings.push({startIndex: 1, endIndex: 2});        
    
    expectedUiGroupings = [
        {rowGrouping: new RowGrouping() , rowIndex: 0, class: "no-group", colspan: 1},
        {rowGrouping: {startIndex:1, endIndex:2}, rowIndex: 1, class: "group group-start", colspan: 1},
        {rowGrouping: new RowGrouping(), rowIndex: 2, class: "group group-end", colspan: 1},
    ];

    var groupingDetails = service.resetGroupingDetails(groupings,searchRows);
    var uiGroupings = service.createUIGrouping(searchRows);

    expect(groupingDetails.maxGroupingLevel).toEqual(1);
    expect(groupingDetails.uiGroupings).toEqual(expectedUiGroupings);
    expect(uiGroupings).toEqual(expectedUiGroupings);
  });  
  
  //Test for seach row deletion 
  test('should reset groupings on selected row deletion', () => {
    let searchRows: FssSearchRow[] = [];
    let groupings: RowGrouping[] = [];
    let expectedGroupings: RowGrouping[] = [];
    let deleteRowIndex: number = 1;
    
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false,""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31T13:00:00.000Z', 'date', false, "12:00"));
    
    groupings.push({startIndex: 1, endIndex: 2});
    groupings.push({startIndex: 0, endIndex: 2}); 
    
    expectedGroupings.push({startIndex: 0, endIndex: 1});   
    
    var rowGroupings = service.resetRowGroupings(groupings,deleteRowIndex);   
    expect(rowGroupings).toEqual(expectedGroupings);
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