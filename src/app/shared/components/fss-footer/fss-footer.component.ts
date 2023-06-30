import { Component } from '@angular/core';

@Component({
  selector: 'app-fss-footer',
  templateUrl: './fss-footer.component.html',
  styleUrls: ['./fss-footer.component.scss']
})
export class FssFooterComponent {
  imageLink = "https://www.gov.uk/ukho";
  imageSrc = "/assets/svg/UKHO%20stacked%20logo.svg";
  imageAlt = "Admiralty Maritime Data Solutions | UK Hydrographic office";
  
}
