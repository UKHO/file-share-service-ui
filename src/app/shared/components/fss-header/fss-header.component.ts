import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';


@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent {
  
  constructor(){
    super();
  }

  ngOnInit(): void {

    this.branding = {
      title : "File Share Service",
      logoImgUrl : "https://design.ukho.dev/svg/Admiralty%20stacked%20logo.svg",
      logoAltText : "Admiralty - Maritime Data Solutions Logo",
      logoLinkUrl : "https://datahub.admiralty.co.uk/portal/apps/sites/#/marine-data-portal"
    };

    this.menuItems = [
      {
        title: 'Search'      
      },
      {
        title: 'Sign in'        
      }
    ];
  }
}





