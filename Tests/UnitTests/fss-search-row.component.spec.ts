import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {jest} from '@jest/globals'

import { FssSearchRowComponent } from '../../src/app/features/fss-search/fss-search-row/fss-search-row.component';
import{FilterPipe} from '../../src/app/features/fss-search/filter.pipe'
import { Field, FssSearchRow, Operator, RowGrouping } from '../../src/app/core/models/fss-search-types';

describe('FssSearchRowComponent', () => {
  let component: FssSearchRowComponent;
  let fixture: ComponentFixture<FssSearchRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({      
      declarations: [ FssSearchRowComponent, FilterPipe ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSearchRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should create FssSearchRowComponent', () => {
    const fixture = TestBed.createComponent(FssSearchRowComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  //Test enable grouping
  test('should return enable grouping true when consecutive search rows checked', () => {
    component = new FssSearchRowComponent();
    component.ngOnChanges();

    let searchRows: FssSearchRow[] = [];       
    
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31', 'date', false, "12:00"));

    component.fssSearchRows = searchRows;
    component.fssSearchRows[0].group=true;
    component.fssSearchRows[1].group=true;
    component.fssSearchRows[2].group=true;   
            
    component.toggleGrouping();    
    var result = component.enableGrouping;    
    
    expect(result).toBe(true);
  });

  //Test disable grouping
  test('should return enable grouping false when non consecutive search rows checked', () => {
    component = new FssSearchRowComponent();
    component.ngOnChanges();

    let searchRows: FssSearchRow[] = [];       
    
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31', 'date', false, "12:00"));

    component.fssSearchRows = searchRows;
    component.fssSearchRows[0].group=true;    
    component.fssSearchRows[2].group=true;   
            
    component.toggleGrouping();    
    var result = component.enableGrouping;    
    
    expect(result).toBe(false);
  });  


  // Test to check emit value when search row delete button is clicked
  test('should emit when the search row delete button is clicked', () => {
      let deleteRowIndex = 2;
      jest.spyOn(component.onSearchRowDeleted, 'emit');
      component.onSearchRowDelete(deleteRowIndex);
      expect(component.onSearchRowDeleted.emit).toHaveBeenCalledWith(2);
    });

    // Test to check emit value when group delete button is clicked
    test('should emit when group delete button is clicked', () => {
      var rowGrouping: RowGrouping={startIndex:1, endIndex:3}; 
      var deleteGrouping ={rowGrouping: rowGrouping}       
      
      jest.spyOn(component.onGroupDeleted, 'emit');
      component.onGroupDelete(rowGrouping);
      expect(component.onGroupDeleted.emit).toHaveBeenCalledWith(deleteGrouping);
    });

    // Test to check emit value when onFieldChanged
    test('should emit when filed change in search row', () => {
      let changedField: any= {value: 'FileSize',text: '@FileSize (in bytes)', type: 'SystemAttribute', dataType: 'number'}
      let rowId: number = 2;

      var expectedEmitValue = { currentFieldValue: changedField, rowId: rowId }

      jest.spyOn(component.onFieldChanged, 'emit');
      component.onFieldChange(changedField,rowId);
      expect(component.onFieldChanged.emit).toHaveBeenCalledWith(expectedEmitValue);
    });

    // Test for onGroupClick()
    test('should emit group when onGroupClick', () => {
      
      component = new FssSearchRowComponent();
      component.ngOnChanges();

      let searchRows: FssSearchRow[] = [];       
      
      searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
      searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
      searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31', 'date', false, "12:00"));

      component.fssSearchRows = searchRows;
      component.fssSearchRows[0].group=true;
      component.fssSearchRows[1].group=true;
      component.fssSearchRows[2].group=true;  

      component.enableGrouping = true;      
      component.onGroupClick();
      component.fssSearchRows.forEach(row => {
        expect(row.group).toBe(false)
    }); 

      expect(component.enableGrouping).toBe(false);
    });

    //Test disable grouping onCheckbox clicking
  test('should disable grouping onCheckbox changed', () => {
    component = new FssSearchRowComponent();
    component.ngOnChanges();

    let searchRows: FssSearchRow[] = [];       
    
    searchRows.push(createSearchRow(1, fields,operators,'AND', 'FileName', 'eq', 'TestReport.pdf', 'text', false, ""));
    searchRows.push(createSearchRow(2, fields,operators,'OR', 'FileSize', 'le', 3000, 'tel', false, ""));
    searchRows.push(createSearchRow(3,fields,operators, 'AND', 'ExpiryDate', 'gt', '2021-12-31', 'date', false, "12:00"));

    component.fssSearchRows = searchRows;
    component.fssSearchRows[0].group=true;
    component.fssSearchRows[1].group=false;
    component.fssSearchRows[2].group=true;   
            
    component.onCheckboxClick();
    var result = component.enableGrouping;    
    
    expect(result).toBe(false);
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