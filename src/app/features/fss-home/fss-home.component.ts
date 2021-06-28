import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-fss-home',
  templateUrl: './fss-home.component.html',
  styleUrls: ['./fss-home.component.scss']
})
export class FssHomeComponent implements OnInit {
  @Output() isPageOverlay = new EventEmitter<boolean>();
  name: string="";
  
  constructor(private msalService: MsalService, 
    private route: Router) { }

  ngOnInit(): void {
  }
  Signin() {
    this.isPageOverlay.emit(true);
    this.msalService.loginPopup().subscribe(response => {
      this.isPageOverlay.emit(false);
      localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
      localStorage.setItem('idToken', response.idToken);
      this.route.navigate(['/']);
    });
  }
}
