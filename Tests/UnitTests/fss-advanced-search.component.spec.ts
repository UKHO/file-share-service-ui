import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from '../../src/app/shared/components/ukho-table/table.module';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { FssSearchComponent } from '../../src/app/features/fss-search/fss-search.component';
import { FilterPipe } from '../../src/app/features/fss-search/filter.pipe';
import { FssSearchResultsComponent } from '../../src/app/features/fss-search/fss-search-results/fss-search-results.component';
import { FssSearchRoutingModule } from '../../src/app/features/fss-search/fss-search-routing.module';
import { FssSearchRowComponent } from '../../src/app/features/fss-search/fss-search-row/fss-search-row.component';
import { FssAdvancedSearchComponent } from '../../src/app/features/fss-search/fss-advanced-search/fss-advanced-search.component';
import { FileShareApiService } from '../../src/app/core/services/file-share-api.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { FssSearchService } from '../../src/app/core/services/fss-search.service';
import { Field, FssSearchRow, Operator, RowGrouping } from '../../src/app/core/models/fss-search-types';
import { FssSearchGroupingService } from '../../src/app/core/services/fss-search-grouping.service';
import { PublicClientApplication } from '@azure/msal-browser';
import { FssSearchHelperService } from '../../src/app/core/services/fss-search-helper.service';
import { FssSearchValidatorService } from '../../src/app/core/services/fss-search-validator.service';
import { AnalyticsService } from '../../src/app/core/services/analytics.service';
import { FssPopularSearchService } from '../../src/app/core/services/fss-popular-search.service';
import { of } from 'rxjs';

describe('FssAdvancedSearchComponent', () => {
  let component: FssAdvancedSearchComponent;
  let fileShareApiService: FileShareApiService;  
  let searchService: FssSearchService;
  let msalService: MsalService;
  let fssSearchHelperService: FssSearchHelperService;
  let fssSearchValidatorService: FssSearchValidatorService;
  let elementRef: ElementRef;
  let searchGroupingService: FssSearchGroupingService;
  let analyticsService: AnalyticsService;
  let popularSearchService: FssPopularSearchService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        FssSearchRoutingModule, HttpClientModule,
        TableModule],
      declarations: [FssAdvancedSearchComponent,
        FssSearchRowComponent,
        FssSearchResultsComponent,
        FilterPipe,
        FssSearchComponent],
      providers: [
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        {
          provide: "googleTagManagerId",
          useValue: "YOUR_GTM_ID"
        },
        MsalService,
        AnalyticsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    AppConfigService.settings = {
      fssConfig: {
        "apiUrl": "https://dummyfssapiurl ",
         displaySimplifiedSearchLink: true
      }
    };
    searchService = TestBed.inject(FssSearchService);    
    fileShareApiService = TestBed.inject(FileShareApiService);
    msalService = TestBed.inject(MsalService);
    fssSearchHelperService = TestBed.inject(FssSearchHelperService);
    fssSearchValidatorService = TestBed.inject(FssSearchValidatorService);
    searchGroupingService = TestBed.inject(FssSearchGroupingService);
    analyticsService = TestBed.inject(AnalyticsService);
    popularSearchService = TestBed.inject(FssPopularSearchService);
      
    component = new FssAdvancedSearchComponent(searchService, fileShareApiService, elementRef, fssSearchHelperService, fssSearchValidatorService, searchGroupingService, popularSearchService, analyticsService, msalService);
    component.observablePopularSearch = of(null);
    component.observableAdvancedSearchTokenRefresh = of();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FssAdvancedSearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should return datatype as "attribute" when UserAttribute is passed', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    expect(fssSearchHelperService.getFieldDataType('$batch(product)', component.fields)).toEqual('attribute');
  });

  test('should return datatype as "string" when SystemAttribute FileName is passed', () => {    
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    expect(fssSearchHelperService.getFieldDataType('FileName', component.fields)).toEqual('string');
  });

  test('should return filtered operators based on number datatype', () => {    
    component.ngOnInit();
    component.operators = searchService.getOperators();
    const expectedOperators: Operator[] = [
      { value: 'eq', text: '=', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'ne', text: '<>', type: 'operator', supportedDataTypes: ['string', 'number', 'date', 'attribute'] },
      { value: 'gt', text: '>', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'ge', text: '>=', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'lt', text: '<', type: 'operator', supportedDataTypes: ['number', 'date'] },
      { value: 'le', text: '<=', type: 'operator', supportedDataTypes: ['number', 'date'] }];
    var result = fssSearchHelperService.getFilteredOperators('number', component.operators);
    expect(result).toEqual(expectedOperators);
  });

  test('should return value type text based on datatype string', () => {    
    component.ngOnInit();
    var expectedValueType = "text";
    var result = fssSearchHelperService.getValueType('string');
    expect(result).toEqual(expectedValueType);
  });

  test('should return operator type nullOperator based on operator value ne null', () => {    
    component.ngOnInit();
    component.operators = searchService.getOperators();
    var expectedOperatorType = "nullOperator";
    var changedOperator = { operatorValue: "ne null", rowId: 1 }
    var result = fssSearchHelperService.getOperatorType(changedOperator.operatorValue, component.operators);
    expect(result).toEqual(expectedOperatorType);
  });

  test('should return second row based on rowid passed', () => {
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
    var result = fssSearchHelperService.getSearchRow(2, searchRows);
    expect(result).toEqual(searchRows[1]);
  });

  it('should return only SystemAttribute fields when type = SystemAttribute is passed through pipe', () => {
    const pipe = new FilterPipe();
    const inputFields: Field[] = [
      { value: 'BusinessUnit', text: '@BusinessUnit', type: 'SystemAttribute', dataType: 'string' },
      { value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' },
      { value: 'MimeType', text: '@MimeType', type: 'SystemAttribute', dataType: 'string' },
      { value: "$batch(cellname)", text: "cellname", type: "UserAttribute", dataType: "attribute" },
      { value: "$batch(Product Type)", text: "Product Type", type: "UserAttribute", dataType: "attribute" }];

    const expectedOutput: Field[] = [
      { value: 'BusinessUnit', text: '@BusinessUnit', type: 'SystemAttribute', dataType: 'string' },
      { value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' },
      { value: 'MimeType', text: '@MimeType', type: 'SystemAttribute', dataType: 'string' }];
    expect(pipe.transform(inputFields, 'type', 'SystemAttribute')).toStrictEqual(expectedOutput);
  });

  it('should return only UserAttribute fields when type = UserAttribute is passed through pipe', () => {
    const pipe = new FilterPipe();
    const inputFields: Field[] = [
      { value: 'BusinessUnit', text: '@BusinessUnit', type: 'SystemAttribute', dataType: 'string' },
      { value: 'FileName', text: '@FileName', type: 'SystemAttribute', dataType: 'string' },
      { value: 'MimeType', text: '@MimeType', type: 'SystemAttribute', dataType: 'string' },
      { value: "$batch(cellname)", text: "cellname", type: "UserAttribute", dataType: "attribute" },
      { value: "$batch(Product Type)", text: "Product Type", type: "UserAttribute", dataType: "attribute" }];

    const expectedOutput: Field[] = [
      { value: "$batch(cellname)", text: "cellname", type: "UserAttribute", dataType: "attribute" },
      { value: "$batch(Product Type)", text: "Product Type", type: "UserAttribute", dataType: "attribute" }];
    expect(pipe.transform(inputFields, 'type', 'UserAttribute')).toStrictEqual(expectedOutput);
  });

  test('should return flag false when FileSize value is passed as number', () => {
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
    searchRows.push(createSearchRow(1, fields, operators, 'AND', 'FileSize', 'eq', 'test', 'tel', false));
    component.fssSearchRows = searchRows;
    component.fields = searchService.getFields(MockUserAttributeFields())
    component.operators = searchService.getOperators();
    var result = fssSearchValidatorService.validateSearchInput(component.fssSearchRows, component.fields, component.operators);
    expect(result).toBe(false);
  });

  test('should return row count 2 when Add new line is called twice', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    component.addSearchRow();
    component.addSearchRow();
    var result = component.fssSearchRows.length
    expect(result).toBe(2);
  });

  test('should return row count 2 when 3 rows exist and delete is called', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    component.addSearchRow();
    component.addSearchRow();
    component.addSearchRow();
    component.onSearchRowDeleted(3);
    var result = component.fssSearchRows.length;
    expect(result).toBe(2);
  });

  test('should hide Value input when nullOperator is selected in the row', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    component.fssSearchRows.push(createSearchRow(1, component.fields, component.operators, 'AND', 'FileSize', 'nullOperator', 'test', 'tel', true));
    fssSearchHelperService.toggleValueInput(component.fssSearchRows[0], 'nullOperator');
    var result = component.fssSearchRows[0].isValueHidden;
    expect(result).toBe(true);
  });

  //Test group already exists validation
  test('should return group already exists validation when duplicate group is added', () => {
    component.ngOnInit();

    var groupings: RowGrouping[] = [];
    groupings.push({ startIndex: 1, endIndex: 2 });
    component.rowGroupings = groupings;

    component.currentGroupStartIndex = 1;
    component.currentGroupEndIndex = 2;
    var resultTrue = component.isGroupAlreadyExist();

    component.currentGroupStartIndex = 1;
    component.currentGroupEndIndex = 3;
    var resultFalse = component.isGroupAlreadyExist();

    expect(resultTrue).toBe(true);
    expect(resultFalse).toBe(false);
  });

  //Test group cannot intersect validation
  test('should return group cannot intersect validation when intersecting group is added', () => {
    component.ngOnInit();

    var groupings: RowGrouping[] = [];
    groupings.push({ startIndex: 1, endIndex: 3 });
    component.rowGroupings = groupings;

    component.currentGroupStartIndex = 0;
    component.currentGroupEndIndex = 2;
    var resultTrue = component.isGroupIntersectWithOther();

    component.currentGroupStartIndex = 1;
    component.currentGroupEndIndex = 2;
    var resultFalse = component.isGroupIntersectWithOther();

    expect(resultTrue).toBe(true);
    expect(resultFalse).toBe(false);
  });

  //Test add grouping
  test('should return group count 2 when 1 groups exist and add group clicked is called', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    component.addSearchRow();
    component.addSearchRow();
    component.addSearchRow();

    var groupings: RowGrouping[] = [];
    groupings.push({ startIndex: 1, endIndex: 2 });
    component.rowGroupings = groupings;

    component.fssSearchRows[0].group = true;
    component.fssSearchRows[1].group = true;
    component.fssSearchRows[2].group = true;

    var expectedGrouping: RowGrouping[] = [{ startIndex: 1, endIndex: 2 }, { startIndex: 0, endIndex: 2 }];

    component.onGroupClicked();
    var result = component.rowGroupings;

    expect(result.length).toBe(2);
    expect(result).toEqual(expectedGrouping);
  });

  // Test modify grouping on search row deletion
  test('should return row count 2 & modify grouping when 3 rows exist and delete is called', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    component.addSearchRow();
    component.addSearchRow();
    component.addSearchRow();

    var groupings: RowGrouping[] = [];
    groupings.push({ startIndex: 0, endIndex: 2 });
    component.rowGroupings = groupings;

    var expectedGrouping: RowGrouping[] = [{ startIndex: 0, endIndex: 1 }];

    component.onSearchRowDeleted(3);
    var resultRowCount = component.fssSearchRows.length;
    var resultGrouping = component.rowGroupings;

    expect(resultRowCount).toBe(2);
    expect(resultGrouping.length).toBe(1);
    expect(resultGrouping).toEqual(expectedGrouping);
  });

  // Test group deletion
  test('should return group count 1 when 2 groups exist and delete group is called', () => {
    component.ngOnInit();
    component.fields = searchService.getFields(MockUserAttributeFields());
    component.addSearchRow();
    component.addSearchRow();
    component.addSearchRow();

    var groupings: RowGrouping[] = [];
    groupings.push({ startIndex: 1, endIndex: 2 });
    groupings.push({ startIndex: 0, endIndex: 2 });
    component.rowGroupings = groupings;

    var deleteGrouping = { rowGrouping: groupings[0] }
    var expectedGrouping = Array(groupings[1]);

    component.onGroupDeleted(deleteGrouping);
    var result = component.rowGroupings;

    expect(result.length).toBe(1);
    expect(result).toEqual(expectedGrouping);
  });


  test('should return row count 2 when addSearchRow function is called twice', () => {
    component.ngOnInit();
    component.refreshFields(MockUserAttributeFields());
    component.addSearchRow();
    component.addSearchRow();
    expect(component.fssSearchRows.length).toBe(2);
  });

  test('should emit when the advanced search button is clicked', () => {
    jest.spyOn(component.ShowSimplifiedSearchClicked, 'emit');
    component.searchToAdvancedSearch();
    expect(component.ShowSimplifiedSearchClicked.emit).toHaveBeenCalledWith();
  });

  test('should show simplified search Link if displaySimplifiedSearchLink is true', () => {    
    const fixture = TestBed.createComponent(FssAdvancedSearchComponent);    
    fixture.componentInstance.observablePopularSearch = of(null);
    fixture.componentInstance.observableAdvancedSearchTokenRefresh = of();
    fixture.detectChanges();
    var displaySimplifiedSearchLink = AppConfigService.settings["fssConfig"].displaySimplifiedSearchLink;
    if(displaySimplifiedSearchLink){
      expect(fixture.nativeElement.querySelector('a').textContent).toBe('Simplified Search');
    }
    else{
      expect(fixture.nativeElement.querySelector('a')).toBeNull();
    }
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
export function MockMSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: "",
      authority: "",
      redirectUri: "/",
      knownAuthorities: [],
      postLogoutRedirectUri: "/",
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  })
};
