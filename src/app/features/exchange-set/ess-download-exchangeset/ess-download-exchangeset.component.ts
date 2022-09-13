import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { ExchangeSetDetails } from 'src/app/core/models/ess-response-types';


@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit {
  displayLoader: boolean = true;
  exchangeSetCellCount: number;
  avgEstimatedSize: any;
  exchangeSetDetails: ExchangeSetDetails;
  result:ExchangeSetDetails;
  requestedProductsNotInExchangeSet : any[];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'warning';
  messageTitle: string = "";
  messageDesc: string = "";
  displayErrorMessage = false;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) {
  }

  ngOnInit() {
    this.exchangeSetDetails= this.essUploadFileService.getExchangeSetDetails();
    this.exchangeSetCellCount = this.exchangeSetDetails.exchangeSetCellCount;
    this.avgEstimatedSize = this.essUploadFileService.getEstimatedTotalSize(this.exchangeSetCellCount);
    this.result=this.essUploadFileService.getExchangeSetDetails();
    this.requestedProductsNotInExchangeSet = this.result.requestedProductsNotInExchangeSet;
    
    if(this.requestedProductsNotInExchangeSet && this.requestedProductsNotInExchangeSet.length > 0){
      this.displayErrorMessage = true;
      this.messageTitle = 'The following ENCs are not included in the Exchange Set:';
      this.showMessage("warning", this.messageTitle);
    }

  }

  switchToESSLandingPage() {
    this.route.navigate(["exchangesets"]);
  }

  showMessage(
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageTitle: string = "", messageDesc: string = ""
  ) {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '-1');
      this.ukhoDialog.nativeElement.focus();
    }
  }

}
