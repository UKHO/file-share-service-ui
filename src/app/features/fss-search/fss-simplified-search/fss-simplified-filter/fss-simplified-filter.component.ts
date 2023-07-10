import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterGroup } from '@ukho/design-system';

@Component({
  selector: 'app-fss-simplified-filter',
  templateUrl: './fss-simplified-filter.component.html',
  styleUrls: ['./fss-simplified-filter.component.scss']
})
export class FssSimplifiedFilterComponent implements OnInit{

  @Input() public filterGroups: FilterGroup[] = [];
  @Output() onApplyFilterButtonClicked = new EventEmitter<FilterGroup[]>();

  constructor() { }
  ngOnInit(): void { }


  onApplyFilterClick()
  {
    console.log("filter applied");
    this.onApplyFilterButtonClicked.emit(this.filterGroups);
  }

  onClearFilterClick() {
    console.log("clearing filter");
    this.filterGroups.forEach((groupItem) => {
      for (let item of groupItem.items) {
        item.selected = false;
      }
    });
  }

} 
