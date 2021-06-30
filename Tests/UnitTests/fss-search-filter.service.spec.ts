import { TestBed } from '@angular/core/testing';
import { FssSearchRow, IFssSearchService} from '../../src/app/core/models/fss-search-types';

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
    searchRows.push(createSearchRow(1, 'AND', 'FileName', 'eq', 'Test.txt'));
    var filter = service.getFilterExpression(searchRows);

    expect(filter).toBe("FileName eq 'Test.txt'");
  });

  //Test for multiple search criteria
  test('should create valid filter expression for multiple search criteria', () => {
    let searchRows: FssSearchRow[] = [];
    searchRows.push(createSearchRow(1, 'AND', 'FileName', 'eq', 'TestReport.pdf'));
    searchRows.push(createSearchRow(2, 'OR', 'FileSize',  'le', 3000));    
    searchRows.push(createSearchRow(3, 'AND', 'ExpiryDate', 'gt', '2021-12-31T13:00:00'));

    var filter = service.getFilterExpression(searchRows);

    expect(filter).toBe("FileName eq 'TestReport.pdf' OR FileSize le 3000 AND ExpiryDate gt 2021-12-31T13:00:00");
  });
});

export function createSearchRow(rowId: number, joinOperator: string, field: string, operator: string, value: any) {
  var row = new FssSearchRow();
  row.rowId = rowId;
  row.selectedJoinOperator = joinOperator;
  row.selectedField = field;
  row.selectedOperator = operator;
  row.value = value;
  return row;
}



