import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';


@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;

  validEncList: string[];
  validEnc: Array<string> = [];
  singleEncVal: string = "";

  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) { }

  ngOnInit(): void {
    this.validEnc = this.essUploadFileService.getValidEncs();
  }

  onFindEnc() {
    this.displayErrorMessage = false;
    this.singleEncVal = this.singleEncVal.trim();
    const isValidEnc = this.essUploadFileService.validateENCFormat(this.singleEncVal);

    if (this.singleEncVal != '') {
      if (isValidEnc) {
        if (!this.validEnc.includes(this.singleEncVal)) {
          if (this.essUploadFileService.checkMaxEncLimit(this.validEnc)) {
            this.showMessage('info', 'Max ENC limit reached.');
          }
          else {
            this.essUploadFileService.addSingleEnc(this.singleEncVal);
          }
        }
        else {
          this.showMessage('info', 'ENC already in list.');
        }
      }
      else {
        this.showMessage('error', 'Invalid ENC number.');
      }
    }
    else {
      this.showMessage('error', 'Please enter ENC number.');
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