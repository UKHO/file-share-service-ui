import { Component, OnInit, Input } from '@angular/core';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { ExchangeSetDetails } from '../../../core/models/ess-response-types';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit {

  exchangeSetDetails: ExchangeSetDetails;
  displayLoader: boolean = true;
  displayDownloadBtn: boolean = false;
  batchDetailsUrl: string;
  batchId: string;
  fssTokenScope: any = [];
  fssSilentTokenRequest: SilentRequest;
  baseUrl: string;
  downloadPath: string;
  downloadUrl: string;

  constructor(private essUploadFileService: EssUploadFileService,
    private fileShareApiService: FileShareApiService,
    private msalService: MsalService) {
    this.fssTokenScope = AppConfigService.settings["fssConfig"].apiScope;
    this.fssSilentTokenRequest = {
      scopes: [this.fssTokenScope],
    };
  }

  ngOnInit(): void {
    this.exchangeSetDetails = this.essUploadFileService.getExchangeSetDetails();
    console.log(this.exchangeSetDetails);
    this.batchDetailsUrl = this.exchangeSetDetails._links.exchangeSetBatchDetailsUri.href;
    this.batchId = this.batchDetailsUrl.substring(this.batchDetailsUrl.indexOf('batch/')).split('/')[1];
    this.checkBatchStatus();
  }

  checkBatchStatus() {

    this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
      this.batchStatusAPI();
    }, error => {
      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.batchStatusAPI();
        })
    })
  }

  batchStatusAPI() {
    this.fileShareApiService.getBatchStatus(this.batchId).subscribe((response) => {
      console.log(response);
      if (response.status == "Committed") {
        this.displayLoader = false;
        this.displayDownloadBtn = true;
      }
      else {
        setTimeout(() => {
          this.checkBatchStatus()
        }, 5000);
      }
    });
  }

  download() {
    this.baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    this.downloadPath = this.exchangeSetDetails._links.exchangeSetFileUri.href.substring(this.exchangeSetDetails._links.exchangeSetFileUri.href.indexOf('/batch'));
    this.downloadUrl=this.baseUrl+this.downloadPath;
    this.displayLoader = true;
    this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
      this.displayLoader = false;

      this.fileShareApiService.refreshToken().subscribe((res) => {
        window.open(this.downloadUrl, "_blank");
      });
    }, error => {
      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.displayLoader = false;
          this.fileShareApiService.refreshToken().subscribe((res) => {
            window.open(this.downloadUrl, "_blank");
          });
        })
    })
  }
}
