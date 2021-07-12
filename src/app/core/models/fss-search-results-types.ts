export interface SearchResultViewModel{
    batchAttributes: BatchAttribute[];
    batchFileDetails: BatchFileDetails;
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