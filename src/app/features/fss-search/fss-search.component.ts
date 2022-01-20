import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-fss-search',
  templateUrl: './fss-search.component.html',
  styleUrls: ['./fss-search.component.scss']
})
export class FssSearchComponent implements OnInit {
  ShowAdvancedSearch:boolean;
  ShowSimplifiedSearch:boolean;
  constructor() { }

  ngOnInit(): void {
    this.ShowAdvancedSearch = true;
    this.ShowSimplifiedSearch = false;
  }

  ShowAdvancedSearchClicked(){
    this.ShowAdvancedSearch = true;
    this.ShowSimplifiedSearch = false;
  }

  ShowSimplifiedSearchClicked(){
    this.ShowAdvancedSearch = false;
    this.ShowSimplifiedSearch = true;
  }

}
