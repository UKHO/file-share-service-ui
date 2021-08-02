import { ElementRef, EventEmitter, OnChanges, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { BatchAttribute, BatchFileDetails, BatchFileDetailsColumnData, BatchFileDetailsRowData, SearchResultViewModel } from 'src/app/core/models/fss-search-results-types';
import { AppConfigService } from '../../../core/services/app-config.service';
import { FileShareApiService } from '../../../core/services/file-share-api.service';
@Component({
  selector: 'app-fss-search-results',
  templateUrl: './fss-search-results.component.html',
  styleUrls: ['./fss-search-results.component.scss']
})
export class FssSearchResultsComponent implements OnChanges {
  @Input() public searchResult: Array<any> = [];
  searchResultVM: SearchResultViewModel[] = [];
  baseUrl: string;
  public removeEventListener: () => void;
  @Output() displayError = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef
    , private fileShareApiService: FileShareApiService) { }

  ngOnChanges(): void {
    this.searchResultVM = [];
    if (this.searchResult.length > 0) {
      var batches = this.searchResult[0];
      for (var i = 0; i < batches.length; i++) {
        this.searchResultVM.push({
          batchAttributes: this.getBatchAttributes(batches[i]),
          batchFileDetails: this.getBatchFileDetails(batches[i])
        });
      }
    }

    setTimeout(() => {
      // Bind click event to each file download link
      var elem = this.elementRef.nativeElement.querySelectorAll('.fileDownload');
      if (elem) {
        elem.forEach((res: any) => {
          res.style.cursor = 'pointer';
          res.addEventListener('click', this.downloadFile.bind(res, this));
        })
      }
    }, 0);
  }

  getfileDetailsColumnData(): BatchFileDetailsColumnData[] {
    var fileDetailsColumnData: BatchFileDetailsColumnData[] = [
      { headerTitle: 'File name', propertyName: 'FileName' },
      { headerTitle: 'MIME type', propertyName: 'MimeType' },
      { headerTitle: 'File size', propertyName: 'FileSize' },
      { headerTitle: 'Download', propertyName: 'Download' }
    ];

    return fileDetailsColumnData;
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
      console.log(link);
      batchFilesRowData.push({
        FileName: files[i]["filename"],
        MimeType: files[i]["mimeType"],
        FileSize: formatBytes(files[i]["fileSize"]),
        Download: '<div class="fileDownload" rel="' + link + '" tabindex="0" role="button" aria-label="Download File"><i class="fa fa-download fa-1x"></i></div>'
      });
    }

    batchFileDetails.columnData = this.getfileDetailsColumnData();
    batchFileDetails.rowData = batchFilesRowData;

    return batchFileDetails;
  }

  public ngOnDestroy() {
    // Cleanup by removing the event listener on destroy    
    var elem = this.elementRef.nativeElement.querySelectorAll('.fileDownload');
    if (elem) {
      elem.forEach((res: any) => {
        res.removeEventListener('click', this.downloadFile.bind(res));
      })
    }
  }

  downloadFile(obj: any, res: any) {
    this.baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    var filePath = res.currentTarget.getAttribute('rel');
    if (filePath) {
      if (!obj.fileShareApiService.isTokenExpired()) {//check if token is expired
        //download file and change the icon to tick when returns true
        res.currentTarget.style.pointerEvents = 'none'; //disable download icon after click
        res.currentTarget.innerHTML = '<i class="fa fa-check"></i>';
        window.open(this.baseUrl + filePath);
      }
      else {//display "Token expired" message when token is expired
        obj.displayError.emit(true);
      }
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