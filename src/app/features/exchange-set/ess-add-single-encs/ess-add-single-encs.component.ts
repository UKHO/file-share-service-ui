import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  @Input() renderedFrom: string;
  @Input() btnText: string;

  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  validEncList: string[];
  validEnc: Array<string> = [];
  txtSingleEnc: string = "";
  addValidEncAlert: string;
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) { }

  ngOnInit(): void {
    this.validEnc = this.essUploadFileService.getValidEncs();
  }

  validateAndAddENC() {
    if (this.renderedFrom == 'encList') {
      this.addEncInList();
    }
    else if ((this.renderedFrom == 'essHome')) {
      this.addSingleEncToList();
    }
  }

  addSingleEncToList() {
    if (this.txtSingleEnc != '') {
      if (this.essUploadFileService.validateENCFormat(this.txtSingleEnc)) {
        this.displayErrorMessage = false;
        this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
        this.essUploadFileService.infoMessage = false;
        this.route.navigate(['exchangesets', 'enc-list']);      
      }
      else {
        this.showMessage('error', 'Invalid ENC number');
      }
    }
    else { this.showMessage('error', 'Please enter ENC number'); }
  }

  addEncInList() {
    this.displayErrorMessage = false;
    this.txtSingleEnc = this.txtSingleEnc.trim();
    const isValidEnc = this.essUploadFileService.validateENCFormat(this.txtSingleEnc);

    if (this.txtSingleEnc != '') {
      if (isValidEnc) {
        if (!this.validEnc.includes(this.txtSingleEnc)) {
          if (this.essUploadFileService.checkMaxEncLimit(this.validEnc)) {
            this.showMessage('info', 'Max ENC limit reached.');
          }
          else {
            this.essUploadFileService.addSingleEnc(this.txtSingleEnc);
            this.addValidEncAlert= this.txtSingleEnc + "  Added to List";
            this.txtSingleEnc = '';
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
