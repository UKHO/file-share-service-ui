import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/core/services/app-config.service';
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
  maxENClimit: number;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;

  constructor(private essUploadFileService: EssUploadFileService) {
    this.maxENClimit = AppConfigService.settings["essConfig"].maxENClimit;
  }

  ngOnInit(): void {
  }

  public records: any[] = [];
  ENCnumber: string[] = new Array<string>();
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
        let csvData = reader.result;  //fetch csv file data
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);   //fetch csv file data row by row
        csvRecordsArray = csvRecordsArray.filter(x => x !== "");  //remove blank values from file

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      };

      reader.onerror = function () {
        console.log('error occured while reading file!');
      };

    } else {
      this.showMessage("error", "File upload error", "Please select a .csv or .txt file");
      this.fileReset();
    }
  }


  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    for (let i = 0; i < csvRecordsArray.length; i++) {
      //fetch only 1st column
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      let encRecord = curruntRecord[0].trim();
      if (this.essUploadFileService.isValidENCnumber(curruntRecord)) {        
        if (!(this.ENCnumber.indexOf(encRecord) != -1) && this.ENCnumber.length != this.maxENClimit) { //find duplicate ENC number in the list and set max limit of 250
          this.ENCnumber.push(encRecord);
        }
      }
    }
    return this.ENCnumber;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
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