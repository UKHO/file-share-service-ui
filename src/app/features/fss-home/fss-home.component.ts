import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-fss-home',
  templateUrl: './fss-home.component.html',
  styleUrls: ['./fss-home.component.scss']
})
export class FssHomeComponent implements OnInit {
  name: string = "";

  constructor(private msalService: MsalService,
    private route: Router) { }

  ngOnInit(): void {
    this.handleSignIn();
  }
  
  Signin() {
    document.getElementById('signInButton')?.click();
  }

  handleSignIn() {
    const account = this.msalService.instance.getAllAccounts()[0];
    if (account != null) {
      this.route.navigate(['search']);
    }
  }
}
