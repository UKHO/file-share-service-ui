import { Router } from '@angular/router';
import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { AppConfigService } from './../../../core/services/app-config.service';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss'],
})
export class EssUploadFileComponent implements OnInit, AfterViewInit {
  validEncList: string[]; 
  encFile: File;
  maxEncsLimit:number;
  maxEncSelectionLimit:number;
  
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router, private essInfoErrorMessageService: EssInfoErrorMessageService, private _elementRef?: ElementRef) {     
        this.maxEncsLimit = AppConfigService.settings['essConfig'].MaxEncLimit;
        this.maxEncSelectionLimit = AppConfigService.settings['essConfig'].MaxEncSelectionLimit;
    }

  ngOnInit(): void {
    this.triggerInfoErrorMessage(false,'info', '');
    this.essUploadFileService.infoMessage = false;
  }

  ngAfterViewInit(): void {
    this.addChooseFileButtonAttribute();
  }

  uploadListener($event: any): void { // called when user selects/drags file on file-input-control
    this.validEncList = [];
    this.encFile = ($event?.srcElement?.files || $event?.dataTransfer?.files)[0];
    this.triggerInfoErrorMessage(false,'info', '');
    if (this.isInvalidEncFile(this.encFile)) {
      this.triggerInfoErrorMessage(true,'error', 'Please select a .csv or .txt file');
      return;
    }
  }

  loadFileReader() { // called on click of proceed button
      if (this.isInvalidEncFile(this.encFile)) {
        this.triggerInfoErrorMessage(true,'error', 'Please select a .csv or .txt file');
        return;
      }
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

  addChooseFileButtonAttribute() {
    let choosefile_input = this._elementRef?.nativeElement.querySelector('#file-upload input[type="file"]');
    let choosefile_label = this._elementRef?.nativeElement.querySelector('#file-upload label');
    choosefile_label?.setAttribute('id', 'chooseFileLabel');
    choosefile_input?.setAttribute('aria-labelledby', 'uploadExplanationText chooseFileLabel');     
  }

  isInvalidEncFile(encFile: File){
    return encFile && encFile.type !== 'text/plain' && encFile.type !== 'text/csv' &&  encFile.type !== 'application/vnd.ms-excel';
  }
}
