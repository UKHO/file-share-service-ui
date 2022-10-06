import { Router } from '@angular/router';
import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EssInfoErrorMessageService } from 'src/app/core/services/ess-info-error-message.service';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss'],
})
export class EssUploadFileComponent implements OnInit {
  validEncList: string[];
  encFile: File;
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router,private essInfoErrorMessageService: EssInfoErrorMessageService) { }

  ngOnInit(): void {
    this.triggerInfoErrorMessage(false,'info', '');
    this.essUploadFileService.infoMessage = false;
  }

  uploadListener($event: any): void {
    this.validEncList = [];
    this.encFile = ($event?.srcElement?.files || $event?.dataTransfer?.files)[0];
    this.triggerInfoErrorMessage(false,'info', '');
    if (this.encFile && this.encFile.type !== 'text/plain' && this.encFile.type !== 'text/csv') {
      this.triggerInfoErrorMessage(true,'error', 'Please select a .csv or .txt file');
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
        this.triggerInfoErrorMessage(true,'info', 'No ENCs found.');
        return;
      }
      if (encList.length > this.validEncList.length) {
        this.essUploadFileService.infoMessage = true;
        this.triggerInfoErrorMessage(true, 'info', 'Some values have not been added to list.');
      }
      this.route.navigate(['exchangesets' , 'enc-list']);
    }
    else {
      this.triggerInfoErrorMessage(true, 'error', 'Please upload valid ENC file.');
    }
  }

  triggerInfoErrorMessage(
    showInfoErrorMessage: boolean,
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.essInfoErrorMessageService.showInfoErrorMessage = {
      showInfoErrorMessage,
      messageType,
      messageDesc,
    };
  }

}
