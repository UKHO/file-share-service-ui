import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterGroup } from '../../../../shared/components/ukho-table/filter.types';
import { AdmiraltyCheckboxCustomEvent } from '@ukho/admiralty-core'
import { DefaultValueAccessor } from '@angular/forms';

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
    this.onApplyFilterButtonClicked.emit(this.filterGroups);
  }

  onCheckBoxClick(item: any) {
    item.selected = !item.selected;
  }


  onCheckBoxChange(changeEvent: Event) {
    let value = changeEvent as CustomEvent<AdmiraltyCheckboxCustomEvent<FilterGroup>>;
    console.log("Start change check")
    console.log(value.detail);
    console.log("End change check")
  }

  onClearFilterClick() {
    this.filterGroups = this.filterGroups.map((group: FilterGroup) => {
      const items = group.items.map((item) => {
        const { selected, ...rest } = item;
        return rest;
      });
      return { ...group, items };
    });
  }
} 
