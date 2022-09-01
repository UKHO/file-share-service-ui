import { Component, OnInit,Input } from '@angular/core';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { ExchangeSetDetails } from 'src/app/core/models/ess-response-types';

@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit {
 
  result:ExchangeSetDetails;
  requestedProductsNotInExchangeSet : any[];
  
  constructor(private essUploadFileService: EssUploadFileService) { 
  }

  ngOnInit(): void {
    this.result=this.essUploadFileService.getExchangeSetDetails();
    this.requestedProductsNotInExchangeSet = this.result.requestedProductsNotInExchangeSet;
 } 

}
