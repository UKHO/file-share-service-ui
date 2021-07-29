import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FssSearchRow, GroupingLevel, UIGrouping } from './../../../core/models/fss-search-types';

@Component({
  selector: 'app-fss-search-row',
  templateUrl: './fss-search-row.component.html',
  styleUrls: ['./fss-search-row.component.scss']
})
export class FssSearchRowComponent implements OnInit {
  @Input() fssSearchRows: FssSearchRow[] = [];
  @Input() groupingLevels: GroupingLevel[] = [];
  @Input() uiGroupings: UIGrouping[] = [];
  @Output() onSearchRowDeleted = new EventEmitter<number>();
  @Output() onFieldChanged = new EventEmitter<{ fieldValue: string, rowId: number }>();
  @Output() onOperatorChanged = new EventEmitter<{ operatorValue: string, rowId: number }>();
  @Output() onGroupClicked = new EventEmitter();
  enableGrouping: Boolean = false; 
  constructor() { }

  ngOnInit(): void {
  }

  onSearchRowDelete(rowId: number) {
    this.onSearchRowDeleted.emit(rowId);
    this.onCheckboxClick();
  }

  onFieldChange(field: any, rowId: number) {
    this.onFieldChanged.emit({ fieldValue: field.select.nativeElement.value, rowId: rowId });
  }

  onOperatorChange(operator: any, rowId: number) {
    this.onOperatorChanged.emit({ operatorValue: operator.select.nativeElement.value, rowId: rowId });

  }

  onCheckboxClick(){   
    let rowIndexArray:Array<number>=[];
    for(var i=0; i<this.fssSearchRows.length; i++){
      if(this.fssSearchRows[i].group){
        rowIndexArray.push(i);
      }
    }
    const differenceAry = rowIndexArray.slice(1).map(function(n:any, i:any) { return n - rowIndexArray[i]; });    
    this.enableGrouping = differenceAry.length>0 && differenceAry.every((value: number) => value == 1);    
  }

  onGroupClick(){     
    if(this.enableGrouping){  
      this.onGroupClicked.emit();

      //Remove check once grouping is added
      this.fssSearchRows.forEach(row => {
          row.group = false;   
      }); 
      this.enableGrouping= false;
    }   
  }
}
