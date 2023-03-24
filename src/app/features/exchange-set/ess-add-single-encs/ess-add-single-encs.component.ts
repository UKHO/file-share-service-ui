import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  @Input() renderedFrom: string;
  @Input() btnText: string;
  validEncList: string[];
  validEnc: Array<string> = [];
  txtSingleEnc = '';
  addValidEncAlert: string;
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router , private essInfoErrorMessageService: EssInfoErrorMessageService) { }

  ngOnInit(): void {
    this.validEnc = this.essUploadFileService.getValidEncs();
    this.triggerInfoErrorMessage(false,'info', '');
  }

  validateAndAddENC() {
    if (this.renderedFrom === 'encList') {
      this.addEncInList();
    }
    else if ((this.renderedFrom === 'essHome')) {
      this.addSingleEncToList();
    }
  }

  addSingleEncToList() {
    if(!this.txtSingleEnc){
      this.triggerInfoErrorMessage(true,'error', 'Please enter ENC number');
      return;
    }

    if(!this.essUploadFileService.validateENCFormat(this.txtSingleEnc)){
      this.triggerInfoErrorMessage(true,'error', 'Invalid ENC number');
      return;
    }

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc)){
      this.triggerInfoErrorMessage(true,'info', 'AIO is not available from this screen - the AIO CD can be downloaded from the main FSS screen');
      return;
    }

    this.triggerInfoErrorMessage(false,'info', '');
    this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
    this.essUploadFileService.infoMessage = false;
    this.route.navigate(['exchangesets', 'enc-list']);
  }

  addEncInList() {
    this.triggerInfoErrorMessage(false,'info', '');
    this.txtSingleEnc = this.txtSingleEnc.trim();
    const isValidEnc = this.essUploadFileService.validateENCFormat(this.txtSingleEnc);

    if(!this.txtSingleEnc){
      this.triggerInfoErrorMessage(true,'error', 'Please enter ENC number');
      return;
    }

    if(!isValidEnc){
      this.triggerInfoErrorMessage(true,'error', 'Invalid ENC number.');
      return;
    }

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc)){
      this.triggerInfoErrorMessage(true,'info', 'AIO is not available from this screen - the AIO CD can be downloaded from the main FSS screen');
      return;
    }

    if(this.validEnc.includes(this.txtSingleEnc.toUpperCase())){
      this.triggerInfoErrorMessage(true,'info', 'ENC already in list.');
      return;
    }

    if (this.essUploadFileService.checkMaxEncLimit(this.validEnc)) {
      this.triggerInfoErrorMessage(true,'info', 'Max ENC limit reached.');
      return;
    }

    this.triggerInfoErrorMessage(false,'info', '');
    this.essUploadFileService.addSingleEnc(this.txtSingleEnc);
    this.addValidEncAlert= this.txtSingleEnc + '  Added to List';
    this.txtSingleEnc = '';
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
