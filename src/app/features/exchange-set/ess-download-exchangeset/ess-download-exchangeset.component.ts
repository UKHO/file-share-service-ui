import { Router } from '@angular/router';
import { AppConfigService } from './../../../core/services/app-config.service';
import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit {
  displayLoader: boolean = true;
  showSeletedEncs: any;
  
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) { 
  }

  ngOnInit(): void {
    this.showSeletedEncs = this.essUploadFileService.getSelectedENCs();
  }

  switchToESSLandingPage() {
    this.route.navigate(["exchangesets"]);
  }
  
}