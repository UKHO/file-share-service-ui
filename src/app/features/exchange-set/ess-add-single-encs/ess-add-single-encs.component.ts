import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { ScsProductInformationService } from './../../../core/services/scs-product-information-api.service';
import { MsalService } from '@azure/msal-angular';
import { AppConfigService } from '../../../core/services/app-config.service';
import { SilentRequest } from '@azure/msal-browser';
import { ProductCatalog } from 'src/app/core/models/ess-response-types';

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

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc.toUpperCase())){
      this.triggerInfoErrorMessage(true,'info', 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
      return;
    }
    this.fetchScsTokenReponse('essHome');
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
    this.fetchScsTokenReponse('encList');
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

  productUpdatesByIdentifiersResponse(encs: any[] , renderedFrom: string) {
    if (encs != null) {
        this.scsProductInformationService.productUpdatesByIdentifiersResponse(encs)
        .subscribe({
          next: (data: ProductCatalog) => {
            console.log(data);
            this.triggerInfoErrorMessage(false,'info', '');
            if(data.products.length === 0){
              this.triggerInfoErrorMessage(true,'error', 'Invalid ENC');
              return;
            }
            if(!this.essUploadFileService.scsProductResponse){
              this.essUploadFileService.scsProductResponse = data;
            }else{
              this.essUploadFileService.scsProductResponse.products.push(data.products[0]);
            }
            if(renderedFrom === 'essHome'){
              this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
              this.essUploadFileService.infoMessage = false;
              this.route.navigate(['exchangesets', 'enc-list']);
            }else if(renderedFrom === 'encList'){
              this.essUploadFileService.addSingleEnc(this.txtSingleEnc);
              this.addValidEncAlert= this.txtSingleEnc + '  Added to List';
              this.txtSingleEnc = '';
            }
          },
          error:(error) => {
            console.log(error);
            this.triggerInfoErrorMessage(true,'error', 'There has been an error');
          }
        });
     }
    }

  fetchScsTokenReponse(renderedFrom:string) {
    const payload: string[] = [this.txtSingleEnc];
    this.msalService.instance.acquireTokenSilent(this.essSilentTokenRequest).then(response => {
      this.productUpdatesByIdentifiersResponse(payload , renderedFrom);
    }, error => {
      this.msalService.instance
        .loginPopup(this.essSilentTokenRequest)
        .then(response => {
        this.productUpdatesByIdentifiersResponse(payload,renderedFrom);
        });
    });
  }
}
