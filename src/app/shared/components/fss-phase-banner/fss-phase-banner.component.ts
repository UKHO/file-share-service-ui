import { Component, OnInit } from '@angular/core';
import { PhaseBannerComponent } from '@ukho/design-system'

@Component({
  selector: 'app-fss-phase-banner',
  templateUrl: './fss-phase-banner.component.html',
  styleUrls: ['./fss-phase-banner.component.scss']
})
export class FssPhaseBannerComponent extends PhaseBannerComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.phase='alpha',
    this.link='mailto:products.feedback@UKHO.gov.uk'
  }
}
