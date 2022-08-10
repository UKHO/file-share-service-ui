import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EssUploadFileService } from 'src/app/core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  txtSingleEnc: string = "";

  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  displayEncTable = false;

  constructor(private essUploadFileService: EssUploadFileService) { }

  ngOnInit(): void {
  }

  validateAndProcessENC() {
    if (this.essUploadFileService.validateENCFormat(this.txtSingleEnc)) {
      this.displayErrorMessage = false;
      this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
      this.displayEncTable = true;
      this.essUploadFileService.getValidEncs();
    }
    else {
      this.showMessage('error', 'Invalid ENC number');
      this.displayEncTable = true;
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
