import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  @Input() renderedFrom = 'Proceed';
  
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  
  txtSingleEnc: string = "";

  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) { }

  ngOnInit(): void {
  }

  validateAndAddENC() {
    if (this.renderedFrom == 'Add ENC') {
      
    }
    else {
      this.addSingleEncToList();
    }
  }

  addSingleEncToList() {
    if (this.txtSingleEnc != '') {
      if (this.essUploadFileService.validateENCFormat(this.txtSingleEnc)) {
        this.displayErrorMessage = false;
        this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
        this.route.navigate(['exchangesets', 'enc-list']);
      }
      else {
        this.showMessage('error', 'Invalid ENC number');
      }
    }
    else { this.showMessage('error', 'Please enter ENC number'); }
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
