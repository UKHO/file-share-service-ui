import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { ScsProductInformationService } from './../../../core/services/scs-product-information-api.service';
import { MsalService } from '@azure/msal-angular';
import { AppConfigService } from '../../../core/services/app-config.service';
import { SilentRequest } from '@azure/msal-browser';

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
  essTokenScope: any = [];
  essSilentTokenRequest: SilentRequest;

  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router , private essInfoErrorMessageService: EssInfoErrorMessageService,
    private scsProductInformationService: ScsProductInformationService,
    private msalService: MsalService) { this.essTokenScope = AppConfigService.settings['essConfig'].apiScope;
    this.essSilentTokenRequest = {
      scopes: [this.essTokenScope]
    }; }

  ngOnInit(): void {
    this.validEnc = this.essUploadFileService.getValidEncs();
    this.triggerInfoErrorMessage(false,'info', '');
  }

  validateAndAddENC() {
    if (this.renderedFrom === 'encList') {
      this.addEncInList();
      this.msalService.instance.acquireTokenSilent(this.essSilentTokenRequest).then(response => {
        this.productUpdatesByIdentifiersResponse(this.validEnc);
      }, error => {
        this.msalService.instance
          .loginPopup(this.essSilentTokenRequest)
          .then(response => {
            this.productUpdatesByIdentifiersResponse(this.validEnc);
          });
      });
    }
    else if ((this.renderedFrom === 'essHome')) {
      this.addSingleEncToList();
      this.msalService.instance.acquireTokenSilent(this.essSilentTokenRequest).then(response => {
        this.productUpdatesByIdentifiersResponse(this.validEnc);
      }, error => {
        this.msalService.instance
          .loginPopup(this.essSilentTokenRequest)
          .then(response => {
            this.productUpdatesByIdentifiersResponse(this.validEnc);
          });
      });
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

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc.toUpperCase())){
      this.triggerInfoErrorMessage(true,'info', 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
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

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc.toUpperCase())){
      this.triggerInfoErrorMessage(true,'info', 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
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

  productUpdatesByIdentifiersResponse(selectedEncList: any[]) {
  if (selectedEncList != null) {
      this.scsProductInformationService.productUpdatesByIdentifiersResponse(selectedEncList).subscribe((result) => {
         
      },
        (error) => {
          this.triggerInfoErrorMessage(true,'error', 'There has been an error');
        }
      );
   }
  }
}
