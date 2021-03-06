import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { AnalyticsService } from '../../src/app/core/services/analytics.service';
import { Field, FssSearchRow, Operator } from '../../src/app/core/models/fss-search-types';
import { FssSearchValidatorService } from '../../src/app/core/services/fss-search-validator.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';

describe('FssSearchValidatorService', () => {
  let service: FssSearchValidatorService;
  let analyticsService: AnalyticsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: "googleTagManagerId",
        useValue: "YOUR_GTM_ID"
      },
        AnalyticsService]
    }).compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://dummyfssapiurl "
      }
    };
    service = TestBed.inject(FssSearchValidatorService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should highlight the value field when FileSize value is not entered', () => {
    let searchRows: FssSearchRow[] = [];
    let frmControl = new FormControl();
    let formControlTime = new FormControl();
    searchRows.push(createSearchRow(2, getFields(), getOperators(), 'OR', 'FileSize', 'eq', '', 'tel', false, frmControl, formControlTime, ''));
    service.validateValueFormControl(searchRows, getFields(), getOperators());
    expect(searchRows[0].valueFormControl.touched).toEqual(true);
  });

  test('should return datatype as "date" when SystemAttribute BatchExpiryDate is passed', () => {
    expect(service.getFieldDataType('ExpiryDate', getFields())).toEqual('date');
  });

  test('should highlight the value field when BatchExpiryDate value is not entered when non null operator is selected', () => {
    let searchRows: FssSearchRow[] = [];
    let frmControl = new FormControl();
    let formControlTime = new FormControl();
    searchRows.push(createSearchRow(2, getFields(), getOperators(), 'OR', 'ExpiryDate', 'eq', '', 'date', false, frmControl, formControlTime, ''));
    service.validateValueFormControl(searchRows, getFields(), getOperators());
    expect(searchRows[0].valueFormControl.touched).toEqual(true);
  });

  test('should return operator type nullOperator based on operator value ne null', () => {
    var expectedOperatorType = "nullOperator";
    var changedOperator = { operatorValue: "ne null", rowId: 1 }
    var result = service.getOperatorType(changedOperator.operatorValue, getOperators());
    expect(result).toEqual(expectedOperatorType);
  });
});

export function createSearchRow(rowId: number, fields: Field[], operators: Operator[], joinOperator: string, field: string, operator: string, value: any, valueType: "time" | "text" | "date" | "email" | "password" | "tel" | "url", isValueHidden: boolean, formControl: FormControl, formControlTime: FormControl, time: string) {
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
  row.valueFormControl = formControl;
  row.valueFormControlTime = formControlTime;
  row.time = time;
  return row;
}

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
