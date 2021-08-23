import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { FileShareApiService } from 'src/app/core/services/file-share-api.service';

@Component({
  selector: 'app-fss-sso-logout',
  templateUrl: './fss-sso-logout.component.html',
  styleUrls: ['./fss-sso-logout.component.scss']
})
export class FssSsoLogoutComponent implements OnInit {

  constructor(private route: Router,
    private fileShareApiService: FileShareApiService,
    private msalService: MsalService) { }

  ngOnInit(): void {
    this.logout();
  }

  logout(){
    this.fileShareApiService.clearCookies().subscribe(res => {
      console.log(res);
    });
    this.msalService.logout();
    localStorage.clear();
    this.route.navigate(['']);
  }

}
