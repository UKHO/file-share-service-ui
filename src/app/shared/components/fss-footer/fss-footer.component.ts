import { Component } from '@angular/core';
import { FooterComponent } from '@ukho/design-system';
import{ constants } from '../../../../../constants';

@Component({
  selector: 'app-fss-footer',
  templateUrl: './fss-footer.component.html',
  styleUrls: ['./fss-footer.component.scss']
})
export class FssFooterComponent extends FooterComponent {

  constructor(){
    super();
  }

  ngOnInit(): void {
    this.imageLink="https://www.admiralty.co.uk/";
    this.imageSrc="https://design.ukho.dev/svg/UKHO stacked logo.svg";
    this.imageAlt="Admirality Maritime Data Solutions | UK Hydrographic office";
    this.text=constants.copyright;
    this.navigation = [
      {
        title:"Privacy policy",
        href:"https://www.admiralty.co.uk/cookie-policy",
      },
      {
        title:"Accessibility",
        href:"https://www.admiralty.co.uk/accessibility"
      }
    ]
  }

}
