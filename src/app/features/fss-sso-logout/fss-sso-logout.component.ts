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
    localStorage.clear();
    this.analyticsService.logOut();
    this.route.navigate(['']);
  }
}
