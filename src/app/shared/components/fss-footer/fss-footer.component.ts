import { Component } from '@angular/core';
import { FooterComponent } from '@ukho/design-system';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-fss-footer',
  templateUrl: './fss-footer.component.html',
  styleUrls: ['./fss-footer.component.scss']
})
export class FssFooterComponent extends FooterComponent {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.imageLink = "https://www.gov.uk/ukho";
    this.imageSrc = "https://design.ukho.dev/svg/UKHO stacked logo.svg";
    this.imageAlt = "Admiralty Maritime Data Solutions | UK Hydrographic office";
    this.text = "© Crown copyright " + new Date().getUTCFullYear() + " UK Hydrographic Office";
    this.navigation = [
      {
        title: "Privacy policy",
        href: "https://www.admiralty.co.uk/cookie-policy",
        newTab: true
      },
      {
        title: "Accessibility",
        href: "#/accessibility",
        newTab: true
      }
    ]
  }
}
