import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FssSearchRow } from './../../../core/models/fss-search-types';

@Component({
  selector: 'app-fss-search-row',
  templateUrl: './fss-search-row.component.html',
  styleUrls: ['./fss-search-row.component.scss']
})
export class FssSearchRowComponent implements OnInit {
  @Input() fssSearchRows: FssSearchRow[]= [];
  @Output() onSearchRowDeleted = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  onSearchRowDelete(rowId: number){
    this.onSearchRowDeleted.emit(rowId);
  }
  
}
