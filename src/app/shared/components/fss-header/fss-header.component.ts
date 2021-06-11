import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@ukho/design-system';
import{ fssConfiguration } from '../../../../../appConfig';


@Component({
  selector: 'app-fss-header',
  templateUrl: './fss-header.component.html',
  styleUrls: ['./fss-header.component.scss']
})
export class FssHeaderComponent extends HeaderComponent {
  
  constructor(private route: Router){
    super();
  }

  ngOnInit(): void {

    this.branding = {
      title : fssConfiguration.fssTitle,
      logoImgUrl : "https://design.ukho.dev/svg/Admiralty%20stacked%20logo.svg",
      logoAltText : "Admiralty - Maritime Data Solutions Logo",
      logoLinkUrl : "https://datahub.admiralty.co.uk/portal/apps/sites/#/marine-data-portal"
    };

    this.menuItems = [
      {
        title: 'Search',
        clickAction: (() => {this.route.navigate(["/Search"])}​​​​​​​​)      
      },
      {
        title: 'Sign in'        
      }
    ];
  }
}





