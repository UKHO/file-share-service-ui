import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

  isDataShow: boolean = false;
  errorMessageExtension = '';
  public records: any[] = [];
  @Input() label = 'Click to choose a file';
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay: any;
  
  uploadFileCsv($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        csvRecordsArray = csvRecordsArray.map(str => str.replace(/[�]/g, ''));
        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
      };
      this.errorMessageExtension ="";
      this.isDataShow = true;
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } else {
      this.errorMessageExtension = ' Please upload file in CSV format.';
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
    return file.name.endsWith('.csv');
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