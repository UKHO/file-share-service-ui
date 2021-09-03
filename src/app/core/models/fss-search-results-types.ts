export interface SearchResultViewModel{
    batchAttributes: BatchAttribute[];
    batchFileDetails: BatchFileDetails;
    BatchID: BatchAttribute;
    BatchPublishedDate: BatchAttribute;
    ExpiryDate: BatchAttribute;
  }
  
  export interface BatchAttribute {
    key: string;
    value: string;
  }
 
  export interface BatchFileDetails{
    columnData: BatchFileDetailsColumnData[];
    rowData:BatchFileDetailsRowData[];
  }
  
  export interface BatchFileDetailsColumnData {  
    headerTitle: string;
    propertyName: string;
  }
  
  export interface BatchFileDetailsRowData {
    FileName: string;
    MimeType: string;
    FileSize: string;
    Download: string;
  }

