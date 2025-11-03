import { Component, Input, Output, EventEmitter,  AfterViewChecked } from '@angular/core';
import { PopularSearchConfigService } from '../../../core/services/popular-search-config.service';
import { SearchType } from '../../../core/models/fss-search-types';

@Component({
  selector: 'app-fss-popular-search-batches',
  standalone: false,
  templateUrl: './fss-popular-search-batches.component.html',
  styleUrls: ['./fss-popular-search-batches.component.scss']
})
export class FssPopularSearchBatchesComponent implements AfterViewChecked {
  
  @Output() popularSearchClicked = new EventEmitter<boolean>();
  @Input() activeSearchType: SearchType;
  popularSearches: any = [];
  advancedPopularSearchConfig: string = "popularsearchconfig.json";
  simplePopularSearchConfig: string = "simplepopularsearchconfig.json";
  currentSearchType: SearchType;
  constructor(private popularSearchConfigService: PopularSearchConfigService) { }


  ngAfterViewChecked() {
    if (this.currentSearchType != this.activeSearchType) {
      this.currentSearchType = this.activeSearchType;

      this.popularSearches = [];
      var requiredConfig = this.advancedPopularSearchConfig;
      if (this.activeSearchType === SearchType.SimplifiedSearch) {
        requiredConfig = this.simplePopularSearchConfig;
      }

      this.popularSearchConfigService.getPopularSearchData(requiredConfig)
        .subscribe((configJson: any) => {
          for (let key in configJson) {
            this.popularSearches.push(configJson[key]);
          }
        });
    }
  }

  onPopularSearchClick(popularSearch:any){
    this.popularSearchClicked.emit(popularSearch)
  }

}
