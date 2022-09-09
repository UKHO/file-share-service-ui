import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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
  requestedProductCount : number;
  avgEstimatedSize: any;
  exchangeSetDetails: ExchangeSetDetails;
  requestedProductsNotInExchangeSet : any[];
  
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) {
  }

  ngOnInit() {
    this.exchangeSetDetails= this.essUploadFileService.getExchangeSetDetails();
    this.exchangeSetCellCount = this.exchangeSetDetails.exchangeSetCellCount;
    this.requestedProductCount = this.exchangeSetDetails.requestedProductCount;
    this.avgEstimatedSize = this.essUploadFileService.getEstimatedTotalSize(this.exchangeSetCellCount);
    this.requestedProductsNotInExchangeSet = this.exchangeSetDetails.requestedProductsNotInExchangeSet;
  }

  switchToESSLandingPage() {
    this.route.navigate(["exchangesets"]);
  }

}
