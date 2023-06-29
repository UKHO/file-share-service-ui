import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { SignInClicked } from '../../core/services/signInClick.service';
@Component({
  selector: 'app-fss-home',
  templateUrl: './fss-home.component.html',
  styleUrls: ['./fss-home.component.scss']
})
export class FssHomeComponent implements OnInit {
  name: string = "";

  constructor(private msalService: MsalService, private signInButtonService: SignInClicked,
    private route: Router) { }

  ngOnInit(): void {}
  
  Signin() {
    //document.getElementById('signInButton')?.click();
    this.signInButtonService.click();
  }

}
