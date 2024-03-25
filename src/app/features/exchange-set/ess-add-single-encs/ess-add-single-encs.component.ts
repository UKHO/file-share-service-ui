import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { ScsProductInformationService } from './../../../core/services/scs-product-information-api.service';
import { MsalService } from '@azure/msal-angular';
import { AppConfigService } from '../../../core/services/app-config.service';
import { SilentRequest } from '@azure/msal-browser';
import { Product, ProductCatalog } from 'src/app/core/models/ess-response-types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit,OnDestroy {
  @Input() renderedFrom: string;
  @Input() btnText: string;
  validEncList: string[];
  validEnc: Array<string> = [];
  txtSingleEnc = '';
  addValidEncAlert: string;
  essTokenScope: any = [];
  essSilentTokenRequest: SilentRequest;
  displayLoader: Boolean = false; 
  products:Product[];
  scsResponse :ProductCatalog;
  private productIdentifierSubscriber: Subscription;

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
    this.displayLoader = true;
    if (this.renderedFrom === 'encList') {
      this.addEncInList();
    }
    else if ((this.renderedFrom === 'essHome')) {
      this.addSingleEncToList();
    }
  }

  addSingleEncToList() {
    if(!this.txtSingleEnc){
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true,'error', 'Please enter ENC number');
      return;
    }

    if(!this.essUploadFileService.validateENCFormat(this.txtSingleEnc)){
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true,'error', 'Invalid ENC number');
      return;
    }

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc.toUpperCase())){
      this.displayLoader = false;
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
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true,'error', 'Please enter ENC number');
      return;
    }

    if(!isValidEnc){
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true,'error', 'Invalid ENC number.');
      return;
    }

    if(!this.essUploadFileService.excludeAioEnc(this.txtSingleEnc.toUpperCase())){
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true,'info', 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
      return;
    }

    if(this.validEnc.includes(this.txtSingleEnc.toUpperCase())){
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true,'info', 'ENC already in list.');
      return;
    }

    if (this.essUploadFileService.checkMaxEncLimit(this.validEnc)) {
      this.displayLoader = false;
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
      this.productIdentifierSubscriber = this.scsProductInformationService.productUpdatesByIdentifiersResponse(encs)
        .subscribe({
          next: (data: ProductCatalog) => {
            console.log(data);
            this.displayLoader = false;
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
              this.essUploadFileService.setValidSingleEncProduct(data);
              this.essUploadFileService.infoMessage = false;
              this.route.navigate(['exchangesets', 'enc-list']);
            }else if(renderedFrom === 'encList'){
              this.essUploadFileService.addSingleEnc(this.txtSingleEnc);
              this.essUploadFileService.addSingleEncProduct(data);
              this.addValidEncAlert= this.txtSingleEnc + '  Added to List';
              this.txtSingleEnc = '';
            }
          },
          error:(error) => {
            console.log(error);
            this.displayLoader = false;
            this.triggerInfoErrorMessage(true,'error', 'There has been an error');
          }
        });
     }
    }

  productUpdatesByDeltaResponse(encs: any[], renderedFrom: string) {
    this.productIdentifierSubscriber = this.scsProductInformationService.productUpdatesByIdentifiersResponse(encs)
      .subscribe({
        next: (productIdentifiersResponse: ProductCatalog) => {
          if (productIdentifiersResponse.products.length != 0) {
            this.scsProductInformationService.productInformationSinceDateTime()
              .subscribe({
                next: (data: ProductCatalog) => {
                  this.displayLoader = false;
                  this.scsResponse = productIdentifiersResponse;
                  this.products = data.products.filter((v) => this.scsResponse.products.some((vd) => v.productName == vd.productName));
                  if (this.products.length != 0) {
                    this.scsResponse.products = this.products;

                    if (renderedFrom === 'essHome') {
                      this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
                      this.essUploadFileService.setValidSingleEncProduct(this.scsResponse);
                      this.essUploadFileService.infoMessage = false;
                      this.route.navigate(['exchangesets', 'enc-list']);
                    } else if (renderedFrom === 'encList') {
                      this.essUploadFileService.addSingleEnc(this.txtSingleEnc);
                      this.essUploadFileService.addSingleEncProduct(this.scsResponse);
                      this.addValidEncAlert = this.txtSingleEnc + '  Added to List';
                      this.txtSingleEnc = '';
                    }
                  }
                  else {
                    this.displayLoader = false;
                    this.triggerInfoErrorMessage(true, 'info', 'We dont have any latest update for uploaded Encs');
                    return;
                  }
                },
                error: (error) => {
                  console.log(error);
                  this.displayLoader = false;
                  if (error.status == 304) {
                    this.triggerInfoErrorMessage(true, 'info', 'We dont have any latest update for uploaded Encs');
                    return;
                  }
                  this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
                }
              });
          }
          else {
            this.displayLoader = false;
            this.triggerInfoErrorMessage(true,'error', 'Invalid ENC number.');
            return;
          }
        },
        error: (error) => {
          console.log(error);
          this.displayLoader = false;
          this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
        }
      })
  }

  scsProductCatalogResponse(encs: any[], renderedFrom: string) {
    if (this.essUploadFileService.exchangeSetDownloadType == 'Delta') {
      this.productUpdatesByDeltaResponse(encs, renderedFrom);
    } else {
      this.productUpdatesByIdentifiersResponse(encs, renderedFrom);
    }
  }

  fetchScsTokenReponse(renderedFrom: string) {
    const payload: string[] = [this.txtSingleEnc];
    this.msalService.instance.acquireTokenSilent(this.essSilentTokenRequest).then(response => {
      this.scsProductCatalogResponse(payload, renderedFrom);
    }, error => {
      this.msalService.instance
        .loginPopup(this.essSilentTokenRequest)
        .then(response => {
          this.scsProductCatalogResponse(payload, renderedFrom);
        });
    });
  }

  ngOnDestroy() {
    if (this.productIdentifierSubscriber) {
      this.productIdentifierSubscriber.unsubscribe();
    }
  }

}
