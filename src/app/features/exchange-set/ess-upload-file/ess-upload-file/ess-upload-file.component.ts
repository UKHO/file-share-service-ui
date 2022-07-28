import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CSVRecord } from './../../../../core/models/ess-csv-model';
import { EssUploadFileService } from './../../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss']
})
export class EssUploadFileComponent implements OnInit {
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  displayMessage: boolean = false;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;

  constructor(private essUploadFileService: EssUploadFileService) {     
  }

  ngOnInit(): void {
  }

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      //regular expression to find blank cell or blank line in csv
      let regEx: string = "/\r\n,|\r\n\r\n|,,|\r\n,\r\n/";

      reader.onload = () => {
        let csvData = reader.result?.slice(0, reader.result.toString().split(/\r\n,|\r\n\r\n|,,|\r\n,\r\n/)[0].length);
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
        this.validateENCFormat();
      };

      reader.onerror = function () {
        console.log('error occured while reading file!');
      };

    } else {
      this.showMessage("error", "File upload error", "Please import valid .csv file.");
      //alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    let csvArr = [];

    for (let i = 0; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      let csvRecord: CSVRecord = new CSVRecord();
      csvRecord.encnumber = curruntRecord[0].trim();
      csvArr.push(csvRecord);
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  validateENCFormat()
  {
    this.essUploadFileService.validate_ENCFormat(this.records);
  }

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '-1');
      this.ukhoDialog.nativeElement.focus();
    }
  }

}