import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FssSearchFilterService } from '../../../core/services/fss-search-filter.service';
import {  Router } from '@angular/router';

    
@Component({
  selector: 'app-fss-simplified-search',
  templateUrl: './fss-simplified-search.component.html',
  styleUrls: ['./fss-simplified-search.component.scss']
})
export class FssSimplifiedSearchComponent implements OnInit {
  fieldValue: string = "";

  @Output() ShowAdvancedSearchClicked = new EventEmitter<boolean>();
  @Output() onSimplifiedSearchClicked = new EventEmitter<string>();
  @Output() ShowEsslinkClicked = new EventEmitter<boolean>();
  
  constructor(  private route: Router) { }

  ngOnInit(): void {
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

