import { Component, Input, OnInit } from '@angular/core';
import { FilterGroup } from '@ukho/design-system';

@Component({
  selector: 'app-fss-simplified-filter',
  templateUrl: './fss-simplified-filter.component.html',
  styleUrls: ['./fss-simplified-filter.component.scss']
})
export class FssSimplifiedFilterComponent implements OnInit{

  @Input() public filterGroups: FilterGroup[] = [];
 

  constructor() { }
  ngOnInit(): void { }

} 
