import { TestBed } from '@angular/core/testing';
import { Field } from '../../src/app/core/models/fss-search-types';

import { FssSearchService } from '../../src/app/core/services/fss-search.service';

describe('FssSearchService', () => {

  let service: FssSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FssSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should convert object of type any into Field[]', () => {

    let fields: Field[] = [];
    fields.push({ value: '$batch(product)', text: 'product', type: 'UserAttribute', dataType: 'attribute' });
    fields.push({ value: '$batch(cellname)', text: 'cellname', type: 'UserAttribute', dataType: 'attribute' });

    let userAttributes = ['product', 'cellname'];
    var result = service.convertToArray(userAttributes);
    expect(result).toStrictEqual(fields);
  });

  test('should return the count of getJoinOperators list as 2', () => {
    var result = service.getJoinOperators().length;
    expect(result).toBe(2);
  });

  test('should return the count of getOperators list as 14', () => {
    var result = service.getOperators().length;
    expect(result).toBe(14);
  });

  test('should return the value of first JoinOperator as and', () => {
    var result = service.getJoinOperators();
    expect(result[0].value).toBe('and');
  });

  test('should return the value of last JoinOperator as or', () => {
    var result = service.getJoinOperators();
    expect(result[1].value).toBe('or');
  });

  test('should return the the value of first Operator list as eq', () => {
    var result = service.getOperators();
    expect(result[0].value).toBe('eq');
  });

  test('should return the the value of last Operator list as not contains', () => {
    var result = service.getOperators();
    expect(result[result.length-1].value).toBe('not contains');
  });
});




