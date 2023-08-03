import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SelectChangeEventDetail } from '@ukho/admiralty-core';
import { FssSearchRow, RowGrouping, UIGrouping, UIGroupingDetails } from './../../../core/models/fss-search-types';

@Component({
  selector: 'app-fss-search-row',
  templateUrl: './fss-search-row.component.html',
  styleUrls: ['./fss-search-row.component.scss']
})
export class FssSearchRowComponent implements OnChanges {
  @Input() fssSearchRows: FssSearchRow[] = [];
  @Input() uiGroupingDetails: UIGroupingDetails = new UIGroupingDetails();    
  @Output() onSearchRowDeleted = new EventEmitter<number>();
  @Output() onOperatorChanged = new EventEmitter<{ operatorValue: string, rowId: number }>();
  @Output() onFieldChanged = new EventEmitter<{ currentFieldValue: string, rowId: number }>();
  label: string; 
  @Output() onGroupClicked = new EventEmitter();
  @Output() onGroupDeleted = new EventEmitter<{rowGrouping:RowGrouping}>();
  enableGrouping: Boolean = false; 
  maxGroupingLevel: number = 0;
  uiGroupings: UIGrouping[] = []; 
  constructor() { }

  ngOnChanges(): void {
    this.maxGroupingLevel = this.uiGroupingDetails.maxGroupingLevel;
    this.uiGroupings = this.uiGroupingDetails.uiGroupings;
  }

  onSearchRowDelete(rowId: number) {
    this.onSearchRowDeleted.emit(rowId);
    this.toggleGrouping();
  }

  onGroupDelete(rowGrouping:RowGrouping) {
    this.onGroupDeleted.emit({rowGrouping});
    this.toggleGrouping();
  }

  onOperatorChange(operator: Event, rowId: number) {
    console.log('emitting change from row'); //rhz
    console.log('operator:', operator);  //rhz
    const data = operator as CustomEvent<SelectChangeEventDetail>; //rhz
    console.log('operator detail: ', data.detail) //rhz
    let result: string = data.detail.value as string; //rhz
    //this.onOperatorChanged.emit({ operatorValue: operator.select.nativeElement.value, rowId: rowId });
    this.onOperatorChanged.emit({ operatorValue: result, rowId: rowId });
  }

  onFieldChange(fieldValue: any, rowId: number){
    this.onFieldChanged.emit({ currentFieldValue: fieldValue, rowId: rowId });
  }

  onCheckboxClick(){   
    this.toggleGrouping();
  }

  toggleGrouping(){
    //Enable/disable grouping based on consecutive rows selection
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
  get totalRowsSearchRow(): number {
    return this.fssSearchRows.length;
  }
}

