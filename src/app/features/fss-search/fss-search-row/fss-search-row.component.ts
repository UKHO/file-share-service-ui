import { Component, Input, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { Field, FssSearchRow } from './../../../core/models/fss-search-types';

@Component({
  selector: 'app-fss-search-row',
  templateUrl: './fss-search-row.component.html',
  styleUrls: ['./fss-search-row.component.scss']
})
export class FssSearchRowComponent implements OnInit {
  @Input() fssSearchRows: FssSearchRow[]= [];
  @Output() onSearchRowDeleted = new EventEmitter<number>();
  @Output() onFieldChanged = new EventEmitter<{ fieldValue: string, rowId: number }>();
  @Output() onOperatorChanged = new EventEmitter<{ operatorValue: string, rowId: number }>();
  constructor() { }

  ngOnInit(): void {
  }

  onSearchRowDelete(rowId: number){
    this.onSearchRowDeleted.emit(rowId);
  }
  onFieldChange(field: any, rowId: number) {
    this.onFieldChanged.emit({ fieldValue: field.select.nativeElement.value, rowId: rowId });
 
      }
    
      onOperatorChange(operator : any, rowId: number){
        this.onOperatorChanged.emit({ operatorValue: operator.select.nativeElement.value, rowId: rowId });
   
      }
}
