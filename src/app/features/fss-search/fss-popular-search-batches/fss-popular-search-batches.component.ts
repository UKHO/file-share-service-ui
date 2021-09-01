import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopularSearchConfigService } from 'src/app/core/services/popular-search-config.service';

@Component({
  selector: 'app-fss-popular-search-batches',
  templateUrl: './fss-popular-search-batches.component.html',
  styleUrls: ['./fss-popular-search-batches.component.scss']
})
export class FssPopularSearchBatchesComponent implements OnInit {

  @Output() isPopularSearch = new EventEmitter<boolean>();
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

  getPopularSearch(popularSearch:any){
    this.isPopularSearch.emit(popularSearch)
  }

}
