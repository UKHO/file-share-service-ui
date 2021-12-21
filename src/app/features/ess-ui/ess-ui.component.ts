import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FileInputComponent } from '@ukho/design-system';

@Component({
  selector: 'app-ess-ui',
  templateUrl: './ess-ui.component.html',
  styleUrls: ['./ess-ui.component.scss']
})
export class EssUiComponent extends FileInputComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit(): void {
  }
  csvRecordsArray: any;
  headersRow:any;
  isDataShow: boolean = false;
  errorMessageExtension = '';
  public records: any[] = [];
  @Input() label = 'Click to choose a file';
  fileInputLabel = "ESS UI File upload for csv file";
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay: any;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  displayMessage: boolean = false;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  errorMessageTitle = "";
  errorMessageDescription = "";

  
  uploadFileCsv($event: any): void {
    this.displayMessage = false;
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        this.csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        this.csvRecordsArray = this.csvRecordsArray.map((str: string) => str.replace(/[�]/g, ''));
        this.headersRow = this.getHeaderArray(this.csvRecordsArray);
        if(!this.ValidateCSVFile(this.csvRecordsArray,this.headersRow))
        {
          this.errorMessageDescription = this.errorMessageDescription;
          this.errorMessageTitle = this.errorMessageTitle;
          this.showMessage(
            "warning",
            this.errorMessageTitle,
            this.errorMessageDescription);
          this.isDataShow = false;
        }
        else
        {
          this.records = this.getDataRecordsArrayFromCSVFile(
            this.csvRecordsArray,
            this.headersRow.length
          );
          this.errorMessageExtension ="";
          this.isDataShow = true;
          
         }
      }
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } else {
      this.errorMessageDescription = this.errorMessageDescription;
          this.errorMessageTitle = this.errorMessageTitle;
          this.showMessage(
            "warning",
            this.errorMessageTitle,
            this.errorMessageDescription);
          this.isDataShow = false;
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CsvData = new CsvData();
        csvRecord.encnumber = curruntRecord[0].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  //check etension
  isValidCSVFile(file: any) {
    this.errorMessageDescription = 'Given file type is not supported. Please upload file in CSV format';
    return file.name.endsWith('.csv');
  }

  ValidateCSVFile(csvRecordsArray = this.csvRecordsArray,headersRow = this.headersRow)
  {
    this.errorMessageTitle = "";
    this.errorMessageDescription = "";
    var flag = true;

    if(csvRecordsArray[0] == '' && csvRecordsArray[1] == '')
        {
          this.errorMessageDescription = "Given csv file is empty or invalid.";
          this.isDataShow = false; 
          flag = false
        }
        var areEqual = headersRow[0].toUpperCase() === 'ENC Data'.toUpperCase();
    if(!areEqual || (areEqual && csvRecordsArray[1] == ''))
        {
          this.errorMessageDescription = 'Given csv file is empty or invalid.';
          this.isDataShow = false;
          flag = false;
        }
    return flag;
  }
  

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

}

export class CsvData {
  public encnumber: any;
}