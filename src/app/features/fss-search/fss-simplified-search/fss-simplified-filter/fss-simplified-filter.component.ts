import { Component, OnInit } from '@angular/core';
import { SimplifiedSearchFilter } from './../../../../core/models/fss-search-types';
@Component({
  selector: 'app-fss-simplified-filter',
  templateUrl: './fss-simplified-filter.component.html',
  styleUrls: ['./fss-simplified-filter.component.scss']
})
export class FssSimplifiedFilterComponent implements OnInit {
  groups: SimplifiedSearchFilter[];
  constructor() { }

  ngOnInit(): void {
    this.groups = [
      {
        title: 'Product',
        items: [
          {
            title: 'AVCS',
            selected: false
          },
          {
            title: 'ADP',
            selected: false
          },
          {
            title: 'eNP',
            selected: false
          },
        ],
        expanded: true
      },
      {
        title: 'Media Type',
        items: [
          {
            title: 'DVD',
            selected: false
          },
          {
            title: 'CD',
            selected: false
          },
          {
            title: 'BASE',
            selected: false
          },
          {
            title: 'ZIP',
            selected: false
          },
        ],
        expanded: true
      },
      {
        title: 'Week number',
        items: [
          {
            title: 'Week 39',
            selected: false
          },
          {
            title: 'Week 40',
            selected: false
          },
          {
            title: 'Week 41',
            selected: false
          },
        ],
        expanded: true
      },
      {
        title: 'Year',
        items: [
          {
            title: '2022',
            selected: false
          },
          {
            title: '2021',
            selected: false
          },
          {
            title: '2020',
            selected: false
          },
        ],
        expanded: true
      }
    ]
  }
}
