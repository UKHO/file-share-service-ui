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
  fileUrl: string;
  batchId: string;
  fssTokenScope: any = [];
  fssSilentTokenRequest: SilentRequest;

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
    this.batchDetailsUrl = this.exchangeSetDetails.links.batchDetailsUri.toString();
    this.batchId = this.batchDetailsUrl.substring(this.batchDetailsUrl.indexOf('batch/')).split('/')[1];
    this.checkBatchStatus(this.batchId)
  }

  checkBatchStatus(batchId: string) {

    this.fileShareApiService.getBatchStatus(batchId).subscribe((response) => {

      console.log(response);
      if (response.status == "Committed") {
        this.displayLoader = false;
        this.displayDownloadBtn = true;
      }
      else {
        setTimeout(() => {
          this.checkBatchStatus(this.batchId)
        }, 5000);
      }
    });
  }

  download() {
    this.fileUrl = this.exchangeSetDetails.links.fileUri.toString();

    this.displayLoader = true;
    this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {

      this.fileShareApiService.refreshToken().subscribe((res) => {
        window.open(this.fileUrl, "_blank");
      });
    }, error => {
      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.fileShareApiService.refreshToken().subscribe((res) => {
            window.open(this.fileUrl, "_blank");
          });
        })
    })
  }
}
