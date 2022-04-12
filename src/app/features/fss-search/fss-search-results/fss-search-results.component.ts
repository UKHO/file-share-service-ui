import { ElementRef, EventEmitter, OnChanges, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { BatchAttribute, BatchFileDetails, BatchFileDetailsRowData, SearchResultViewModel } from 'src/app/core/models/fss-search-results-types';
import { AppConfigService } from '../../../core/services/app-config.service';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-fss-search-results',
  templateUrl: './fss-search-results.component.html',
  styleUrls: ['./fss-search-results.component.scss']
})
export class FssSearchResultsComponent implements OnChanges {
  @Input() public searchResult: Array<any> = [];
  @Input() public currentPage: number;
  searchResultVM: SearchResultViewModel[] = [];
  baseUrl: string;
  public removeEventListener: () => void;
  @Output() handleTokenExpiry = new EventEmitter<boolean>();
  downloadFileWindow:any;
  downloadAllFileWindow:any;

  constructor(private elementRef: ElementRef
    , private fileShareApiService: FileShareApiService
    , private analyticsService: AnalyticsService) { }

  ngOnChanges(): void {
    this.searchResultVM = [];
    if (this.searchResult.length > 0) {
      let currentPage = this.currentPage; 
      var batches = this.searchResult[0];
      for (var i = 0, srNo = 1; i < batches.length; i++, srNo++) {
        this.searchResultVM.push({
          batchAttributes: this.getBatchAttributes(batches[i]),
          batchFileDetails: this.getBatchFileDetails(batches[i]),
          BatchID: { key: 'Batch ID', value: batches[i]['batchId'] },
          BatchPublishedDate: { key: 'Batch published date', value: batches[i]['batchPublishedDate'] },
          ExpiryDate: { key: 'Batch expiry date', value: batches[i]['expiryDate'] },
          allFilesZipSize:batches[i]['allFilesZipSize'],
          SerialNumber: ((currentPage - 1) * 10) + srNo
        });
      }
    }
  }

  getfileDetailsColumnData(): string[] {
    return ['FileName', 'MimeType', 'FileSize', 'Download'];
  }

  getBatchAttributes(batch: any) {
    var attributes = batch["attributes"];
    var batchAttributes: BatchAttribute[] = [];
    for (var i = 0; i < attributes.length; i++) {
      batchAttributes.push({
        key: attributes[i]["key"],
        value: attributes[i]["value"]
      });
    }

    return batchAttributes;
  }

  getBatchFileDetails(batch: any) {
    var files = batch["files"];
    var batchFilesRowData: BatchFileDetailsRowData[] = [];
    var batchFileDetails: BatchFileDetails = { columnData: [], rowData: [] };
    for (var i = 0; i < files.length; i++) {
      var link = files[i]["links"]["get"]["href"];
      batchFilesRowData.push({
        FileName: files[i]["filename"],
        MimeType: files[i]["mimeType"],
        FileSize: formatBytes(files[i]["fileSize"]),
        FileLink: link
      });
    }

    batchFileDetails.columnData = this.getfileDetailsColumnData();
    batchFileDetails.rowData = batchFilesRowData;

    return batchFileDetails;
  }
  
  downloadFile(obj: any, fileData: any) {
    this.baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    var filePath = fileData.FileLink;    
    if (filePath) {
      if (!this.fileShareApiService.isTokenExpired()) {//check if token is expired
        //download file and change the icon to tick when returns true
        obj.style.pointerEvents = 'none'; //disable download icon after click
        obj.className = 'fa fa-check';

        this.downloadFileWindow = window.open(this.baseUrl + filePath);
        setTimeout(() => {
          this.closeDownloadFileWindow();
        }, 5000);
      }    
      else {//display "Token expired" message when token is expired        
        obj.handleTokenExpiry.emit(true);
      }
    }
  }

 closeDownloadFileWindow(){
    if(!this.downloadFileWindow.closed){
      this.downloadFileWindow.close();
    }
  }

  downloadAll(batchId: string) {
    this.baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    var filePath = `/batch/${batchId}/files`;

    //check if token is expired
    if (!this.fileShareApiService.isTokenExpired()) {
      this.downloadAllFileWindow = window.open(this.baseUrl + filePath);
      setTimeout(() => {
        this.closeDownloadAllFileWindow();
      }, 5000);

      //Filter elements based on batchid attribute 
      var elements = this.elementRef.nativeElement
                    .querySelectorAll(`[data-file-download-batch-id="${batchId}"]`);

      // Download all the files and change the icon to tick.
      for (let element of elements) {
        element.style.pointerEvents = 'none';
        element.className = 'fa fa-check';
      }
    }
    else {
      //display "Token expired" message when token is expired        
      this.handleTokenExpiry.emit(true);
    }

    this.analyticsService.downloadAll();
  }

  closeDownloadAllFileWindow(){
    if(!this.downloadAllFileWindow.closed){
      this.downloadAllFileWindow.close();
    }
  }
}

// Convert file size from bytes to respective size units
export function formatBytes(bytes: number) {
  if (bytes == 0) {
    return "0 B";
  }
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toPrecision(3)) + " " + sizes[i];
}