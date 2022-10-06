export interface SearchResultViewModel{
    batchAttributes: BatchAttribute[];
    batchFileDetails: BatchFileDetails;
    BatchID: BatchAttribute;
    BatchPublishedDate: BatchAttribute;
    ExpiryDate: BatchAttribute;
    allFilesZipSize:number;
    SerialNumber: number; 
    batchAttributeList:BatchAttributeList[];
  }
  
  export interface BatchAttribute {
    key: string;
    value: string;
  }
 
  export interface BatchAttributeList {
    batchAttributeList:BatchAttribute[]
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

