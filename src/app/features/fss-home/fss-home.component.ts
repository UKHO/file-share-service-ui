import { Component } from '@angular/core';
//import { Router } from '@angular/router';
//import { MsalService } from '@azure/msal-angular';
import { SignInClicked } from '../../core/services/signInClick.service';
@Component({
  selector: 'app-fss-home',
  templateUrl: './fss-home.component.html',
  styleUrls: ['./fss-home.component.scss']
})
export class FssHomeComponent  {
  name: string = "";

  constructor(private signInButtonService: SignInClicked) { }

  
  Signin() {
    //document.getElementById('signInButton')?.click();
    this.signInButtonService.click();
  }

}
