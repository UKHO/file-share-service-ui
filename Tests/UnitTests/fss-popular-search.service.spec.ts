import { TestBed } from '@angular/core/testing';
import { Field, FssSearchRow, Operator } from '../../src/app/core/models/fss-search-types';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';
import { MockUserAttributeFields } from './fss-search.component.spec';

import { FssPopularSearchService } from '../../src/app/core/services/fss-popular-search.service';

describe('FssPopularSearchService', () => {
    let service: FssPopularSearchService;
    let searchService: FssSearchService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FssPopularSearchService);
        searchService = TestBed.inject(FssSearchService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    test('should return datatype as "string" when SystemAttribute BusinessUnit is passed', () => {
        expect(service.getFieldDataType('BusinessUnit', searchService.getFields(MockUserAttributeFields()))).toEqual('string');
    });

    test('should return filtered operators based on date datatype', () => {
        var dataType = service.getFieldDataType('BatchPublishedDate', searchService.getFields(MockUserAttributeFields()))
        const expectedOperators: Operator[] = [
          { value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
          { value: 'ne', text: '<>', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
          {value: 'eq null',text: '= null', type:'nullOperator', supportedDataTypes:['date','attribute']},
          {value: 'ne null',text: '<> null', type:'nullOperator', supportedDataTypes:['date','attribute']},
          { value: 'gt', text: '>', type: 'operator', supportedDataTypes: ['number', 'date'] },
          { value: 'ge', text: '>=', type: 'operator', supportedDataTypes: ['number', 'date'] },
          { value: 'lt', text: '<', type: 'operator', supportedDataTypes: ['number', 'date'] },
          { value: 'le', text: '<=', type: 'operator', supportedDataTypes: ['number', 'date'] }];
        var result = service.getFilteredOperators(dataType, searchService.getOperators());
        expect(result).toEqual(expectedOperators);
      });

      test('should return value type date based on datatype date', () => {
        var expectedValueType = "date";
        var result = service.getValueType('date');
        expect(result).toEqual(expectedValueType);
      });

      test('should return 7 days previous date when 7,0,0 is passed in getDateBeforeNDays ', () => {
        var expectedResult: any = eval('new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0) - 7*24*60*60*1000)');
        var result = service.getDateBeforeNDays(7,0,0);
        expect(result).toEqual(expectedResult);
      });

      test('should return week number 37 when todays date passed is 2021-09-15', () => {
        var expectedResult: any = 37;
        var result = service.getWeekNumber(new Date("2021-09-15"));
        console.log(result);
        expect(result).toEqual(expectedResult);
      });

});

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