import { Component } from '@angular/core';
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
    this.signInButtonService.click();
  }

}
