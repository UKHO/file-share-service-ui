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
    //this.filterGroups.forEach((groupItem) => {
    //  for (let item of groupItem.items) {
    //    item.selected = false;
    //  }
   // });
    this.filterGroups = this.filterGroups.map((group: FilterGroup) => {
      const items = group.items.map((item) => {
        const { selected, ...rest } = item;
        return rest;
      });
      return { ...group, items };
    });
  }
} 
