import { EssUploadFileService } from './../../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss'],
})
export class EssUploadFileComponent implements OnInit {
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  validEncList: string[];
  encFile: File;
  constructor(private essUploadFileService: EssUploadFileService) { }

  ngOnInit(): void {
  }

  uploadListener($event: any): void {
    this.validEncList = [];
    this.encFile = $event.srcElement.files[0];
    this.displayErrorMessage = false;
    if (this.encFile && this.encFile.type !== 'text/plain' && this.encFile.type !== 'text/csv') {
      this.showMessage('error', 'Please select a .csv or .txt file');
    }
  }

  loadFileReader() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.processEncFile(e.target.result);
    };
    reader.readAsText(this.encFile);
  }

  processEncFile(encFileData: string): void {
    /*
      trims leading & trailing whitespaces , splits texts in new lines
      trims leading & trailing individual ENC's whitespaces
    */
    let encList = this.essUploadFileService.getEncFileData(encFileData);
    if (this.essUploadFileService.isValidEncFile(this.encFile.type, encList)) {
      encList = this.essUploadFileService.extractEncsFromFile(this.encFile.type, encList);
      this.essUploadFileService.setValidENCs(encList);
      this.validEncList = this.essUploadFileService.getValidEncs();
      if (this.validEncList.length === 0) {
        this.showMessage('info', 'No ENCs found.');
      }
      else if (encList.length > this.validEncList.length) {
        this.showMessage('info', 'Some values have not been added to list.');
      }    
    }
    else {
      this.showMessage('error', 'Please upload valid ENC file.');
    }
  }

  showMessage(
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.messageType = messageType;
    this.messageDesc = messageDesc;
    this.displayErrorMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }

}
