import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, SelectModule, CheckboxModule, TextinputModule, DialogueModule, ExpansionModule, CardModule, TableModule } from '@ukho/design-system';

import { FilterPipe } from '../../src/app/features/fss-search/filter.pipe';
import { FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FssSearchRoutingModule } from '../../src/app/features/fss-search/fss-search-routing.module';
import { FssSearchRowComponent } from '../../src/app/features/fss-search/fss-search-row/fss-search-row.component';
import { FssSearchComponent } from '../../src/app/features/fss-search/fss-search.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';
import { FssSearchFilterService } from '../../src/app/core/services/fss-search-filter.service';
import { Field, FssSearchRow, Operator } from '../../src/app/core/models/fss-search-types';

describe('FssSearchComponent', () => {
  let component: FssSearchComponent;

  let fileShareApiService: FileShareApiService;
  let searchFilterservice: FssSearchFilterService;
  let searchService: FssSearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        FssSearchRoutingModule, HttpClientModule,
        ButtonModule, SelectModule, CheckboxModule, TextinputModule, DialogueModule, ExpansionModule, CardModule, TableModule],
      declarations: [FssSearchComponent,
        FssSearchRowComponent,
        FssSearchResultsComponent,
        FilterPipe],
      providers: [FileShareApiService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://fss-dev-webapp.azurewebsites.net/"
      }
    };
    searchService = TestBed.inject(FssSearchService);
    searchFilterservice = TestBed.inject(FssSearchFilterService);
    fileShareApiService = TestBed.inject(FileShareApiService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FssSearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should return datatype as "attribute" when UserAttribute is passed', () => {
    component = new FssSearchComponent(searchService, searchFilterservice, fileShareApiService);
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    console.log(component);
    expect(component.getFieldDataType('$batch(product)')).toEqual('attribute');
  });

  test('should return datatype as "string" when SystemAttribute FileName is passed', () => {
    component = new FssSearchComponent(searchService, searchFilterservice, fileShareApiService);
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    console.log(component);
    expect(component.getFieldDataType('FileName')).toEqual('string');
  });

  test('should return filtered operators based on number datatype', () => {
    component = new FssSearchComponent(searchService, searchFilterservice, fileShareApiService);
    component.ngOnInit();
    const expectedOperators: Operator[] = [
      { value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'ne', text: '<>', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'gt', text: '>', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'ge', text: '>=', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'lt', text: '<', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'le', text: '<=', type: 'operator', supportedDataTypes: ['number', 'date'] }];
    var result = component.getFilteredOperators('number');
    console.log(result);
    expect(result).toEqual(expectedOperators);
  });

  test('should return value type text based on datatype string', () => {
    component = new FssSearchComponent(searchService, searchFilterservice, fileShareApiService);
    component.ngOnInit();
    var expectedValueType = "text";
    var result = component.getValueType('string');
    console.log(result);
    expect(result).toEqual(expectedValueType);
  });

  test('should return operator type nullOperator based on operator value ne null', () => {
    component = new FssSearchComponent(searchService, searchFilterservice, fileShareApiService);
    component.ngOnInit();
    var expectedOperatorType = "nullOperator";
    var changedOperator = { operatorValue: "ne null", rowId: 1 }
    var result = component.getOperatorType(changedOperator);
    console.log(result);
    expect(result).toEqual(expectedOperatorType);
  });

  test('should return second row based on rowid 2', () => {
    component = new FssSearchComponent(searchService, searchFilterservice, fileShareApiService);
    component.ngOnInit();
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
    searchRows.push(createSearchRow(1, fields, operators, 'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false));
    searchRows.push(createSearchRow(2, fields, operators, 'OR', 'FileSize', 'le', 3000, 'tel', false));
    searchRows.push(createSearchRow(3, fields, operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31T13:00:00.000Z', 'date', false));
    component.fssSearchRows = searchRows;
    var result = component.getSearchRow(2);
    console.log(result);
    expect(result).toEqual(searchRows[1]);
  });


});

export function MockUserAttributeFields() {
  return [
    "product",
    "cellname",
    "Product Type",
    "Year",
    "Week Number",
    "S63 Version",
    "Exchange Set Type",
    "Media Type",
    "Key1",
    "Key3"
  ]
}

export function createSearchRow(rowId: number, fields: Field[], operators: Operator[], joinOperator: string, field: string, operator: string, value: any, valueType: "time" | "text" | "date" | "email" | "password" | "tel" | "url", valueIsdisabled: boolean) {
  var row = new FssSearchRow();
  row.rowId = rowId;
  row.fields = fields,
    row.operators = operators;
  row.selectedJoinOperator = joinOperator;
  row.selectedField = field;
  row.selectedOperator = operator;
  row.value = value;
  row.valueType = valueType;
  row.valueIsdisabled = valueIsdisabled;
  return row;
}
