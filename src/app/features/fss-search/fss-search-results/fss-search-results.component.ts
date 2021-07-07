import { ElementRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { BatchAttribute, FileDetails, RowData, SearchResults } from 'src/app/core/models/fss-search-results-types';

@Component({
  selector: 'app-fss-search-results',
  templateUrl: './fss-search-results.component.html',
  styleUrls: ['./fss-search-results.component.scss']
})
export class FssSearchResultsComponent implements OnInit {
  @Input() public resultList : Array <any> = [];
  batchAttribute: BatchAttribute[]=[];
  rowData: RowData[]=[]; 
  fileData: FileDetails;
  searchResults: SearchResults[]=[];

  public removeEventListener: () => void;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void { 

    this.searchResults=[];
    for(var i=0; i < this.resultList.length; i++) {
      var entries = this.resultList[i];      
      for(var j=0; j < entries.length; j++) {
        this.batchAttribute=[];
        this.fileData= { columnData:[], rowData:[] };      
        this.rowData= [];
        // Extract batch attributes
        var attributes = entries[j]["attributes"];
        for(var x=0; x < attributes.length; x++){
          this.batchAttribute.push({
            key: attributes[x]["key"],
            value:attributes[x]["value"]
          });
        }
        // Extract file details
        var fileDetails = entries[j]["files"];
        for(var k=0; k < fileDetails.length; k++){
          this.rowData.push({
            FileName: fileDetails[k]["filename"], 
            MimeType: fileDetails[k]["mimeType"], 
            FileSize: formatBytes(fileDetails[k]["fileSize"]),  
            Download: '<div class="fileDownload"><i class="fa fa-download fa-1x"></i></div>'            
          });          
        }
        this.fileData.columnData = columnHeaders.headings;
        this.fileData.rowData = this.rowData;
        this.searchResults.push({
          batchAttributes:this.batchAttribute,
          fileDetails:this.fileData
        });
      }       
    }
  } 

  ngAfterViewInit() {
    // Bind click event to each file download link
    var elem = this.elementRef.nativeElement.querySelectorAll('.fileDownload');
    if (elem) {
      elem.forEach((res: any ) => {
        res.style.cursor = 'pointer';
        res.addEventListener('click', this.downloadFile.bind(res));        
      })
    }
  }

  public ngOnDestroy() {
    // Cleanup by removing the event listener on destroy    
    var elem = this.elementRef.nativeElement.querySelectorAll('.fileDownload');
    if (elem) {
      elem.forEach((res: any ) => {
        res.removeEventListener('click', this.downloadFile.bind(res));        
      })
    }
  }

  downloadFile(res:any){
    res.currentTarget.innerHTML = '<i class="fa fa-check"></i>'; 
  }
}

export const columnHeaders = {
  headings: [
    {headerTitle: 'File name',propertyName: 'FileName'},
    {headerTitle: 'MIME type',propertyName: 'MimeType'},
    {headerTitle: 'File size',propertyName: 'FileSize'},
    {headerTitle: 'Download',propertyName: 'Download'}
  ]};

// Convert file size from bytes to respective size units
export function formatBytes(bytes:number) {
  if(bytes== 0)
  {
      return "0 b";
  }
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toPrecision(3)) + " " + sizes[i];  
}