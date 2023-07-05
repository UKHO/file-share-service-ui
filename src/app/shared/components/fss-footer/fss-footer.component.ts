import { Component } from '@angular/core';

@Component({
  selector: 'app-fss-footer',
  templateUrl: './fss-footer.component.html',
  styleUrls: ['./fss-footer.component.scss']
})
export class FssFooterComponent {
  imageLink: string = "https://www.gov.uk/ukho";
  imageSrc: string = "/assets/svg/UKHO%20stacked%20logo.svg";
  imageAlt: string = "Admiralty Maritime Data Solutions | UK Hydrographic office";
  privacyUrl: string = "https://www.admiralty.co.uk/cookie-policy";
  privacyTitle: string = "Privacy Policy";
  accessibilityTitle: string = "Accessibility";
  accessibilityUrl: string = "#/accessibility";
}
