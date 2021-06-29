import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fss-search-results',
  templateUrl: './fss-search-results.component.html',
  styleUrls: ['./fss-search-results.component.scss']
})
export class FssSearchResultsComponent implements OnInit {
  @Input() public resultList : Array <any> = [];
  constructor() { }

  ngOnInit(): void {
  } 
}
