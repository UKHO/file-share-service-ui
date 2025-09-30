import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FssSearchFilterService } from '../../../core/services/fss-search-filter.service';
import { Router } from '@angular/router';
import { AppConfigService } from '../../../core/services/app-config.service';

    
@Component({
  selector: 'app-fss-simplified-search',
  standalone: false,
  templateUrl: './fss-simplified-search.component.html',
  styleUrls: ['./fss-simplified-search.component.scss']
})
export class FssSimplifiedSearchComponent implements OnInit {
  fieldValue: string = "";

  @Output() ShowAdvancedSearchClicked = new EventEmitter<boolean>();
  @Output() onSimplifiedSearchClicked = new EventEmitter<string>();
  @Output() ShowEsslinkClicked = new EventEmitter<boolean>();
  maxEncSelectionLimit: number;
  
  constructor(  private route: Router) { }

  ngOnInit(): void {
    this.maxEncSelectionLimit = Number.parseInt(
      AppConfigService.settings['essConfig'].MaxEncSelectionLimit,
      10
    );
  }

  searchToSimplifiedSearch(){
    this.ShowAdvancedSearchClicked.emit();
  }
  navigatetoexchangesets(){
    this.route.navigate(["exchangesets"]);
  }
  getSimplifiedSearchResult() {
    this.onSimplifiedSearchClicked.emit(this.fieldValue);
  }  
}

