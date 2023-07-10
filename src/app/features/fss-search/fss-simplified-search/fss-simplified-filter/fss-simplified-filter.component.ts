import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterGroup } from '@ukho/design-system';
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

  onCheckBoxChange(changeEvent: Event) {
    let value = changeEvent as CustomEvent<AdmiraltyCheckboxCustomEvent<FilterGroup>>;
    console.log(value.detail);
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
