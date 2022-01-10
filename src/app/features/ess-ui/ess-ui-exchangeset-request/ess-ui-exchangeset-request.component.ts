import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FileInputComponent } from '@ukho/design-system';

@Component({
  selector: 'app-ess-ui-exchangeset-request',
  templateUrl: './ess-ui-exchangeset-request.html',
  styleUrls: ['./ess-ui-exchangeset-request.scss']
})
export class EssUiExchangesetRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  csvRecordsArray: any;
  headersRow: any;
  public records: any[] = [];
  fileInputLabel = "ESS UI file upload for csv file";
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay: any;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc: string = "";
  displayMessage: boolean = false;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  errorMessageDescription = "";

  uploadFileCsv($event: any): void {
    this.records = [];
    this.displayMessage = false;
    let file;
    if ($event.type == 'drop') {
      file = $event.dataTransfer.files[0];
    }
    else {
      file = $event.srcElement.files[0];
    }
    if (this.isValidCSVFile(file)) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let csvData = reader.result;
        this.csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        this.csvRecordsArray = this.csvRecordsArray.map((str: string) => str.replace(/[�]| {2,}/g, ''));
        this.headersRow = this.getHeaderArray(this.csvRecordsArray);
        if (!this.validateCSVFile(this.csvRecordsArray, this.headersRow)) {
          this.errorMessageDescription = this.errorMessageDescription;
          this.showMessage(
            "error",
            this.errorMessageDescription);
        }
        else {
          this.records = this.getDataRecordsFromCSVFile(
            this.csvRecordsArray,
            this.headersRow.length
          );
        }
      }
      reader.onerror = function () {
        console.log('an error has occured while reading the file.');
      };
    } else {
      this.errorMessageDescription = 'Given file type is not supported. Please upload file in CSV format.';
      this.showMessage(
        "error",
        this.errorMessageDescription);
    }
  }

  getDataRecordsFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataRecords = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length === headerLength) {
        let csvRecord: CsvData = new CsvData();
        csvRecord.encnumber = curruntRecord[0].trim();
        dataRecords.push(csvRecord);
      }
    }
    return dataRecords;
  }

  isValidCSVFile(file: any) {
    return file.name.toString().toLowerCase().endsWith('.csv');
  }

  hasRecordsToShow(): boolean {
    return this.records.length > 0;
  }

  validateCSVFile(csvRecordsArray = this.csvRecordsArray, headersRow = this.headersRow) {
    this.errorMessageDescription = "";
    if (csvRecordsArray[0] === '' && csvRecordsArray[1] === '') {
      this.errorMessageDescription = "Given csv file is empty.";
      return false;
    }
    var areEqual = headersRow[0].toUpperCase() === 'ENC Data'.toUpperCase();
    if (!areEqual || (areEqual && (typeof csvRecordsArray[1] === 'undefined' || csvRecordsArray[1] === ''))) {
      this.errorMessageDescription = 'Given csv file is invalid.';
      return false;
    }
    return true;
  }

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageDesc = messageDesc;
    this.displayMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    return headers;
  }
}

export class CsvData {
  public encnumber: any;
}