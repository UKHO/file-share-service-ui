import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fss-simplified-search',
  templateUrl: './fss-simplified-search.component.html',
  styleUrls: ['./fss-simplified-search.component.scss']
})
export class FssSimplifiedSearchComponent implements OnInit {
  fieldValue: string = "";
  
 
  @Output() ShowAdvancedSearchClicked = new EventEmitter<boolean>();
  @Output() onSimplifiedSearchClicked = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  searchToSimplifiedSearch(){
    this.ShowAdvancedSearchClicked.emit();
  }

  getSimplifiedSearchResult() {
    this.onSimplifiedSearchClicked.emit(this.fieldValue);
  }  
}

