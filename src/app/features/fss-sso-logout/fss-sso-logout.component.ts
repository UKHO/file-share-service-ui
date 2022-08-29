import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileShareApiService } from 'src/app/core/services/file-share-api.service';

@Component({
  selector: 'app-fss-sso-logout',
  templateUrl: './fss-sso-logout.component.html',
  styleUrls: ['./fss-sso-logout.component.scss']
})
export class FssSsoLogoutComponent implements OnInit {

  constructor(private route: Router,
    private fileShareApiService: FileShareApiService,
    private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.logout();
  }

  logout(){
    // this.fileShareApiService.clearCookies().subscribe(res => {
    // });
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    localStorage.clear();
    this.route.navigate(['']);
    this.analyticsService.logOut();
  }

}
