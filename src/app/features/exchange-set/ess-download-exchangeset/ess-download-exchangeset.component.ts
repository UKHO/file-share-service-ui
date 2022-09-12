import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { ExchangeSetDetails } from '../../../core/models/ess-response-types';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit {

  exchangeSetDetails: ExchangeSetDetails;
  displayLoader: boolean = false;
  displayEssLoader: boolean = true;
  displayDownloadBtn: boolean = false;
  batchDetailsUrl: string;
  batchId: string;
  fssTokenScope: any = [];
  fssSilentTokenRequest: SilentRequest;
  baseUrl: string;
  downloadPath: string;
  downloadUrl: string;
  exchangeSetCellCount: number;
  avgEstimatedSize: any;
  requestedProductsNotInExchangeSet: any[];

  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;

  constructor(private essUploadFileService: EssUploadFileService,
    private fileShareApiService: FileShareApiService,
    private msalService: MsalService,
    private route: Router) {
    this.fssTokenScope = AppConfigService.settings["fssConfig"].apiScope;
    this.fssSilentTokenRequest = {
      scopes: [this.fssTokenScope],
    };
  }

  ngOnInit(): void {
    this.exchangeSetDetails = this.essUploadFileService.getExchangeSetDetails();
    this.exchangeSetCellCount = this.exchangeSetDetails.exchangeSetCellCount;
    this.avgEstimatedSize = this.essUploadFileService.getEstimatedTotalSize(this.exchangeSetCellCount);
    this.requestedProductsNotInExchangeSet = this.exchangeSetDetails.requestedProductsNotInExchangeSet;
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
      if (response.status == "Committed") {
        this.displayEssLoader = false;
        this.displayDownloadBtn = true;
      }
      else if (response.status == "CommitInProgress" || response.status == "Incomplete") {
        setTimeout(() => {
          this.checkBatchStatus()
        }, 5000);
      }
      else {
        this.showMessage("warning", "Something went wrong");
        this.displayEssLoader = false;
      }
    });
  }

  download() {
    this.displayLoader = true;
    this.baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    this.downloadPath = this.exchangeSetDetails._links.exchangeSetFileUri.href;
    this.downloadUrl = this.baseUrl + this.downloadPath.substring(this.downloadPath.indexOf('/batch'));
    this.msalService.instance.acquireTokenSilent(this.fssSilentTokenRequest).then(response => {
      this.fileShareApiService.refreshToken().subscribe((res) => {
        this.displayLoader = false;
        window.open(this.downloadUrl, "_blank");
      });
    }, error => {
      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.fileShareApiService.refreshToken().subscribe((res) => {
            this.displayLoader = false;
            window.open(this.downloadUrl, "_blank");
          });
        })
    })
  }

  switchToESSLandingPage() {
    this.route.navigate(["exchangesets"]);
  }

  showMessage(
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.messageType = messageType;
    this.messageDesc = messageDesc;
    this.displayErrorMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }
}
