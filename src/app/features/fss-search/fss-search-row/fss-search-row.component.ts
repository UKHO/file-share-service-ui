import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FssSearchRow } from './../../../core/models/fss-search-types';

@Component({
  selector: 'app-fss-search-row',
  templateUrl: './fss-search-row.component.html',
  styleUrls: ['./fss-search-row.component.scss']
})
export class FssSearchRowComponent implements OnInit {
  @Input() fssSearchRows: FssSearchRow[] = [];
  @Output() onSearchRowDeleted = new EventEmitter<number>();
  @Output() onOperatorChanged = new EventEmitter<{ operatorValue: string, rowId: number }>();
  @Output() onFieldChanged = new EventEmitter<{ currentFieldValue: string, rowId: number }>();
  label: string; 
  constructor() { }

  ngOnInit(): void {
  }

  onSearchRowDelete(rowId: number) {
    this.onSearchRowDeleted.emit(rowId);
  }

  onOperatorChange(operator: any, rowId: number) {
    this.onOperatorChanged.emit({ operatorValue: operator.select.nativeElement.value, rowId: rowId });
  }

  onFieldChange(fieldValue: any, rowId: number){
    this.onFieldChanged.emit({ currentFieldValue: fieldValue, rowId: rowId });
  }
}
