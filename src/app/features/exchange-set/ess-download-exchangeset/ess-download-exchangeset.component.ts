import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { ExchangeSetDetails } from '../../../core/models/ess-response-types';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';

@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit ,OnDestroy{

  exchangeSetDetails: ExchangeSetDetails;
  displayLoader: boolean = false; 
  batchDetailsUrl: string;
  batchId: string;
  fssTokenScope: any = [];
  fssSilentTokenRequest: SilentRequest;
  baseUrl: string;
  downloadPath: string;
  downloadUrl: string;
  displayErrorMessage = false;
  displayMessage = false;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  @ViewChild('ukhoTarget') ukhoDialogForEnc: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  exchangeSetLoading = false;
  exchangeSetReady = false;
  downloadComplete = false;
  constructor(private essUploadFileService: EssUploadFileService,
    private fileShareApiService: FileShareApiService,
    private msalService: MsalService,
    private route: Router,
    private essInfoErrorMessageService: EssInfoErrorMessageService
    ) {
    this.fssTokenScope = AppConfigService.settings['fssConfig'].apiScope;
    this.fssSilentTokenRequest = {
      scopes: [this.fssTokenScope],
    };

    this.showProgressMessage(true, false, false);
  }

  ngOnInit(): void {
    this.exchangeSetDetails = this.essUploadFileService.getExchangeSetDetails();
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
        });
    });
  }

  batchStatusAPI() {
    this.fileShareApiService.getBatchStatus(this.batchId).subscribe((response) => {
      if (response.status == 'Committed') {
        this.showProgressMessage(false, true, false);
      }
      else if (response.status == 'CommitInProgress' || response.status == 'Incomplete') {
        setTimeout(() => {
          this.checkBatchStatus();
        }, 5000);
      }
      else {
        this.triggerInfoErrorMessage(true,'warning', 'Something went wrong');
        this.showProgressMessage(false, false, false);
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
        window.open(this.downloadUrl, '_blank');        
      });
    }, error => {
      this.msalService.instance
        .loginPopup(this.fssSilentTokenRequest)
        .then(response => {
          this.fileShareApiService.refreshToken().subscribe((res) => {
            this.displayLoader = false;
            window.open(this.downloadUrl, '_blank');            
          });
        });
    });
    this.showProgressMessage(false, false, true);
  }

  switchToESSLandingPage() {
    this.route.navigate(['exchangesets']);
  }

  triggerInfoErrorMessage(
    showInfoErrorMessage: boolean,
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.essInfoErrorMessageService.showInfoErrorMessage = {
      showInfoErrorMessage,
      messageType,
      messageDesc
    };
  }

  ngOnDestroy(): void {
    this.triggerInfoErrorMessage(false , 'warning','');
  }

  showProgressMessage(showLoading: boolean, showReady: boolean, showComplete: boolean): void {
    this.exchangeSetLoading = showLoading;
    this.exchangeSetReady = showReady;
    this.downloadComplete = showComplete;
  }
}
