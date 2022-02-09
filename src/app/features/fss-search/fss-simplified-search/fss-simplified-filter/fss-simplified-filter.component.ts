import { Component, Input, OnChanges } from '@angular/core';
import { SimplifiedSearchFilter, SimplifiedSearchFilterItem } from './../../../../core/models/fss-search-types';
@Component({
  selector: 'app-fss-simplified-filter',
  templateUrl: './fss-simplified-filter.component.html',
  styleUrls: ['./fss-simplified-filter.component.scss']
})
export class FssSimplifiedFilterComponent implements OnChanges {
  @Input() public filterResult: Array<any> = [];
  filterGroups: SimplifiedSearchFilter[] = [];
  constructor() { }

  ngOnChanges(): void {
    this.filterGroups = [];
    if (this.filterResult.length > 0) {
      var batches = this.filterResult;
      for (var i = 0; i < batches.length; i++) {
        this.filterGroups.push({
          title : batches[i].key,
          items : this.getAttributesValues(batches[i].values),
          expanded : true
        });
      }
    }
  }
    
  getAttributesValues(batch:Array<any> = []) {
      var batchAttributesValues: SimplifiedSearchFilterItem[] = [];
      for (var i = 0; i < batch.length; i++) {
        batchAttributesValues.push({
          title : batch[i],
          selected : false
        });
      }
      return batchAttributesValues;
    } 
  } 

