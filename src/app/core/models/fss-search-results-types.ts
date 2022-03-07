export interface SearchResultViewModel{
    batchAttributes: BatchAttribute[];
    batchFileDetails: BatchFileDetails;
    BatchID: BatchAttribute;
    BatchPublishedDate: BatchAttribute;
    ExpiryDate: BatchAttribute;
    allFilesZipSize:number;
  }
  
  export interface BatchAttribute {
    key: string;
    value: string;
  }
 
  export interface BatchFileDetails{
    columnData: string[];
    rowData:BatchFileDetailsRowData[];
  }
  
  export interface BatchFileDetailsRowData {
    FileName: string;
    MimeType: string;
    FileSize: string;
    FileLink: string;
  }

