export interface SearchResults{
    batchAttributes: BatchAttribute[];
    fileDetails: FileDetails;
  }
  
  export interface BatchAttribute {
    key: string;
    value: string;
  }
  
  export interface FileDetails{
    columnData: ColumnData[];
    rowData:RowData[];
  }
  
  export interface ColumnData {  
    headerTitle: string;
    propertyName: string;
  }
  
  export interface RowData {
    FileName: string;
    MimeType: string;
    FileSize: string;
    Download: string;
  }