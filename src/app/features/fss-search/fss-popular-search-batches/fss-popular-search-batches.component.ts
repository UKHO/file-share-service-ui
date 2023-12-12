import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopularSearchConfigService } from '../../../core/services/popular-search-config.service';
import { SelectChangeEventDetail } from '@ukho/admiralty-core';

@Component({
  selector: 'app-fss-popular-search-batches',
  templateUrl: './fss-popular-search-batches.component.html',
  styleUrls: ['./fss-popular-search-batches.component.scss']
})
export class FssPopularSearchBatchesComponent implements OnInit {
  
  @Output() popularSearchClicked = new EventEmitter<boolean>();
  popularSearches:any = [];

  constructor(private popularSearchConfigService: PopularSearchConfigService) { }

  ngOnInit(): void {
    this.popularSearchConfigService.getPopularSearchData()
    .subscribe((configJson: any) => {
      for(let key in configJson){
        this.popularSearches.push(configJson[key]);
      }
    });
  }

  onPopularSearchClick(popularSearch: any) {

    this.popularSearchClicked.emit(popularSearch)
  }

  onSelectionChange(operator: Event) {
    const customEventData = operator as CustomEvent<SelectChangeEventDetail>;
    let data: string = customEventData.detail.value as string;

    //console.log("data: ", this.popularSearches[0]);
    //const key = data;
    const item = this.popularSearches.find((obj: { displayName: string; }) => obj.displayName == data);
    //console.log("found data: ", item);

    
    this.popularSearchClicked.emit(item);
    
  }

}
