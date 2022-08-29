import { Component, OnInit, Input } from '@angular/core';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { FileShareApiService } from 'src/app/core/services/file-share-api.service';
import { ExchangeSetDetails } from 'src/app/core/models/ess-response-types';

@Component({
  selector: 'app-ess-download-exchangeset',
  templateUrl: './ess-download-exchangeset.component.html',
  styleUrls: ['./ess-download-exchangeset.component.scss']
})
export class EssDownloadExchangesetComponent implements OnInit {

  exchangeSetDetails: ExchangeSetDetails;
  displayLoader: boolean = true;
  displayDownloadBtn: boolean = false;
  batchStatusUrl: string;
  fileUrl: string;
  batchId: string


  constructor(private essUploadFileService: EssUploadFileService,
    private fileShareApiService: FileShareApiService) {

  }

  ngOnInit(): void {
    this.exchangeSetDetails = this.essUploadFileService.getExchangeSetDetails();
    this.batchStatusUrl = this.exchangeSetDetails.links.batchStatusUri;
    //this.batchId = this.batchStatusUrl.substring(this.batchStatusUrl.lastIndexOf('batch/', -1), this.batchStatusUrl.indexOf('/status'));
    //this.batchStatusUrl.endsWith('/batch');
    this.batchId = this.batchStatusUrl.substring(this.batchStatusUrl.indexOf('batch/'), this.batchStatusUrl.indexOf('/status')).split('/')[1];
    this.checkBatchStatus(this.batchId)
  }

  checkBatchStatus(_batchId: string) {
    this.fileShareApiService.getBatchStatus(_batchId).subscribe((response) => {
      this.displayLoader = false;
      console.log(response);
    });
  }

  download() { }

}
