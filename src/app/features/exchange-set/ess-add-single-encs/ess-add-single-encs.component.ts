import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { ScsProductInformationApiService } from './../../../core/services/scs-product-information-api.service';
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
export class EssAddSingleEncsComponent implements OnInit, OnDestroy {
  @Input() renderedFrom: string;
  @Input() btnText: string;
  validEncList: string[];
  validEnc: Array<string> = [];
  txtSingleEnc = '';
  addValidEncAlert: string;
  essTokenScope: any = [];
  essSilentTokenRequest: SilentRequest;
  displayLoader: Boolean = false;
  products: Product[];
  scsResponse: ProductCatalog;
  showAio: boolean = false;
  isAioChecked: boolean = false;
  aioCell: string;
  private productIdentifierSubscriber: Subscription;

  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router, private essInfoErrorMessageService: EssInfoErrorMessageService,
    private scsProductInformationApiService: ScsProductInformationApiService,
    private msalService: MsalService) {
    this.essTokenScope = AppConfigService.settings['essConfig'].apiScope;
    this.essSilentTokenRequest = {
      scopes: [this.essTokenScope]
    };
    this.aioCell = AppConfigService.settings['essConfig'].aioCell || '';
  }

  ngOnInit(): void {
    this.validEnc = this.essUploadFileService.getValidEncs();
    this.triggerInfoErrorMessage(false, 'info', '');

    this.checkAioVisibility()
  }

  checkAioVisibility() {
    if (this.aioCell && !this.validEnc.includes(this.aioCell)) {
      this.showAio = true;
    } else {
      this.showAio = false;
    }
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
    if (!this.txtSingleEnc) {
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true, 'error', 'Please enter ENC number');
      return;
    }

    if (!this.essUploadFileService.validateENCFormat(this.txtSingleEnc)) {
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true, 'error', 'Invalid ENC number');
      return;
    }
    this.fetchScsTokenReponse('essHome');
  }

  addEncInList() {
    this.triggerInfoErrorMessage(false, 'info', '');
    this.txtSingleEnc = this.txtSingleEnc.trim();
    const isValidEnc = this.essUploadFileService.validateENCFormat(this.txtSingleEnc);

    if (!this.txtSingleEnc) {
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true, 'error', 'Please enter ENC number');
      return;
    }

    if (!isValidEnc) {
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true, 'error', 'Invalid ENC number');
      return;
    }

    if (this.validEnc.includes(this.txtSingleEnc.toUpperCase())) {
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true, 'info', 'ENC already in list');
      return;
    }

    if (this.essUploadFileService.checkMaxEncLimit(this.validEnc)) {
      this.displayLoader = false;
      this.triggerInfoErrorMessage(true, 'info', 'Max ENC limit reached');
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

  productUpdatesByIdentifiersResponse(encs: any[], renderedFrom: string) {
    if (encs != null) {
      this.scsProductInformationApiService.scsProductIdentifiersResponse(encs)
        .subscribe({
          next: (data: ProductCatalog) => {
            this.processProductUpdatesByIdentifiers(data, renderedFrom);
          },
          error: (error) => {
            console.log(error);
            this.displayLoader = false;
            this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
          }
        });
    }
  }

  productUpdatesByDeltaResponse(encs: any[], renderedFrom: string) {
    this.productIdentifierSubscriber = this.scsProductInformationApiService.scsProductIdentifiersResponse(encs)
      .subscribe({
        next: (productIdentifiersResponse: ProductCatalog) => {
          if (productIdentifiersResponse.products.length != 0) {
            this.scsProductInformationApiService.getProductsFromSpecificDateByScsResponse()
              .subscribe({
                next: (data: ProductCatalog) => {
                  this.displayLoader = false;
                  this.scsResponse = productIdentifiersResponse;
                  this.products = data.products.filter((v) => this.scsResponse.products.some((vd) => v.productName == vd.productName));
                  if (this.products.length != 0) {
                    this.scsResponse.products = this.products;
                    this.processProductUpdatesByIdentifiers(this.scsResponse, renderedFrom);
                  }
                  else {
                    this.displayLoader = false;
                    this.triggerInfoErrorMessage(true, 'info', 'There have been no updates for the ENCs in the date range selected');
                    return;
                  }
                },
                error: (error) => {
                  this.displayLoader = false;
                  if (error.status == 304) {
                    this.triggerInfoErrorMessage(true, 'info', 'There have been no updates for the ENCs in the date range selected');
                    return;
                  }
                  this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
                }
              });
          }
          else {
            this.displayLoader = false;
            this.triggerInfoErrorMessage(true, 'error', 'Invalid ENC number');
            return;
          }
        },
        error: (error) => {
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
    const payload: string[] = [this.txtSingleEnc.toUpperCase()];
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

  processProductUpdatesByIdentifiers(productCatalog: ProductCatalog, renderedFrom: string) {
    this.displayLoader = false;
    this.triggerInfoErrorMessage(false, 'info', '');
    if (productCatalog.products.length === 0) {
      this.triggerInfoErrorMessage(true, 'error', 'Invalid ENC number');
      return;
    }
    if (!this.essUploadFileService.scsProductResponse) {
      this.essUploadFileService.scsProductResponse = productCatalog;
    } else {
      this.essUploadFileService.scsProductResponse.products.push(productCatalog.products[0]);
    }
    if (renderedFrom === 'essHome') {
      this.essUploadFileService.setValidSingleEnc(this.txtSingleEnc);
      this.essUploadFileService.infoMessage = false;
      this.route.navigate(['exchangesets', 'enc-list']);
    } else if (renderedFrom === 'encList') {
      this.essUploadFileService.addSingleEnc(this.txtSingleEnc);
      this.addValidEncAlert = this.txtSingleEnc + '  Added to List';
      this.txtSingleEnc = '';
      this.checkAioVisibility();
      this.isAioChecked = false;
    }
  }

  onClick(): void {
    this.isAioChecked = !this.isAioChecked;
    if (this.isAioChecked) {
      this.txtSingleEnc = this.aioCell;
    } else {
      this.txtSingleEnc = '';
    }
  }

  ngOnDestroy() {
    if (this.productIdentifierSubscriber) {
      this.productIdentifierSubscriber.unsubscribe();
    }
  }
}
