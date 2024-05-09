import { Router } from '@angular/router';
import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { AppConfigService } from './../../../core/services/app-config.service';
import { FileInputChangeEventDetail } from '@ukho/admiralty-core';
import { ScsProductInformationApiService } from './../../../core/services/scs-product-information-api.service';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { NotReturnedProduct, Product, ProductCatalog } from 'src/app/core/models/ess-response-types';
import { Subscription } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss'],
})
export class EssUploadFileComponent implements OnInit, AfterViewInit,OnDestroy {
  validEncList: string[];
  encFile: File;
  maxEncsLimit: number;
  maxEncSelectionLimit: number;
  essTokenScope: any = [];
  essSilentTokenRequest: SilentRequest;
  displayLoader: boolean = false;
  products: Product[];
  scsResponse:ProductCatalog;
  private productIdentifierSubscriber: Subscription;
  scsInvalidProduct: NotReturnedProduct[];
  
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router, private essInfoErrorMessageService: EssInfoErrorMessageService, 
    private scsProductInformationApiService: ScsProductInformationApiService, private msalService: MsalService,
    private _elementRef?: ElementRef,
    ) {
    this.maxEncsLimit = AppConfigService.settings['essConfig'].MaxEncLimit;
    this.maxEncSelectionLimit = AppConfigService.settings['essConfig'].MaxEncSelectionLimit;
    this.essTokenScope = AppConfigService.settings['essConfig'].apiScope;
    this.essSilentTokenRequest = {
      scopes: [this.essTokenScope]
    };
  }

  ngOnInit(): void {
    this.triggerInfoErrorMessage(false, 'info', '');
    this.essUploadFileService.infoMessage = false;
  }

  ngAfterViewInit(): void {
    this.addChooseFileButtonAttribute();
  }

  onFileInputChange(changeEvent: Event) {
    this.validEncList = [];
    const data = changeEvent as CustomEvent<FileInputChangeEventDetail>;
    const fileList: File[] = data.detail.files;
    if (fileList.length > 1) {
      this.triggerInfoErrorMessage(true, 'error', 'Only one file can be processed at a time');
      return;
    }
    this.encFile = fileList[0];
    this.triggerInfoErrorMessage(false, 'info', '');
    if (this.isInvalidEncFile(this.encFile)) {
      this.triggerInfoErrorMessage(true, 'error', 'Please select a .csv or .txt file');
      return;
    }
  }

  loadFileReader() { // called on click of proceed button
    if (this.isInvalidEncFile(this.encFile)) {
      this.triggerInfoErrorMessage(true, 'error', 'Please select a .csv or .txt file');
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
        if(this.essUploadFileService.aioEncFound){
          this.triggerInfoErrorMessage(true, 'error', `No valid ENCs found. <br/> AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.`);
          return;
        }
        this.triggerInfoErrorMessage(true, 'error', 'No valid ENCs found');
        return;
      }
      this.fetchScsTokenReponse();
    }
    else {
      this.triggerInfoErrorMessage(true, 'error', 'Please upload valid ENC file');
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

  isInvalidEncFile(encFile: File) {
    return encFile && encFile.type !== 'text/plain' && encFile.type !== 'text/csv' && encFile.type !== 'application/vnd.ms-excel';
  }

  productUpdatesByIdentifiersResponse(encs: any[]) {
    if (encs != null) {
      this.scsProductInformationApiService.scsProductIdentifiersResponse(encs)
        .subscribe({
          next: (productIdentifiersResponse: ProductCatalog) => {
            if (productIdentifiersResponse.products.length != 0) {
              this.displayLoader = false;
              this.essUploadFileService.scsProductResponse = productIdentifiersResponse;
              let validEncList = this.essUploadFileService.scsProductResponse.products.map(p => p.productName);
              this.essUploadFileService.setValidEncsByApi(validEncList);
              this.route.navigate(['exchangesets', 'enc-list']);
            }
            else {
              this.displayLoader = false;
              if (this.essUploadFileService.aioEncFound) {
                this.triggerInfoErrorMessage(true, 'error', 'No valid ENCs found. <br/>AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
                return;
              } else {
                this.triggerInfoErrorMessage(true, 'error', 'No valid ENCs found');
                return;
              }
            }
          },
          error: (error) => {
            console.log(error);
            this.displayLoader = false;
            this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
          }
        });
    }
  }

  productUpdatesByDeltaResponse(encs: any[]) {
    if (encs != null) {
      this.productIdentifierSubscriber = this.scsProductInformationApiService.scsProductIdentifiersResponse(encs)
        .subscribe({
          next: (productIdentifiersResponse: ProductCatalog) => {
            if (productIdentifiersResponse.products.length != 0) {
              this.scsInvalidProduct = productIdentifiersResponse.productCounts.requestedProductsNotReturned;
              this.scsProductInformationApiService.getProductsFromSpecificDateByScsResponse()
                .subscribe({
                  next: (result: ProductCatalog) => {
                    this.displayLoader = false;
                    this.scsResponse = productIdentifiersResponse;
                    this.products = result.products.filter((v) => this.scsResponse.products.some((vd) => v.productName == vd.productName));
                    if (this.products.length != 0) {
                      this.scsResponse.products = this.products;
                      let validEncList = this.products.map(p => p.productName);
                      this.essUploadFileService.setValidEncsByApi(validEncList);
                      this.essUploadFileService.scsProductResponse = this.scsResponse;
                      this.route.navigate(['exchangesets', 'enc-list']);
                    } else if (this.essUploadFileService.aioEncFound && this.scsInvalidProduct && this.scsInvalidProduct.length > 0) {
                      this.displayLoader = false;
                      let invalidProd = this.scsInvalidProduct.map(obj => obj.productName).join(', ');
                      this.triggerInfoErrorMessage(true, 'warning', `Invalid cells -  ${invalidProd}. <br/> There have been no updates for the ENCs in the date range selected. <br/> AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.`);
                      return;
                    } else if (this.scsInvalidProduct && this.scsInvalidProduct.length > 0) {
                      let invalidProd = this.scsInvalidProduct.map(obj => obj.productName).join(', ');
                      this.triggerInfoErrorMessage(true, 'warning', `Invalid cells -  ${invalidProd}. <br/> There have been no updates for the ENCs in the date range selected.`);
                      return;
                    } else if (this.essUploadFileService.aioEncFound) {
                      this.triggerInfoErrorMessage(true, 'info', 'There have been no updates for the ENCs in the date range selected. <br/> AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
                      return;
                    }
                    else {
                      this.displayLoader = false;
                      this.triggerInfoErrorMessage(true, 'info', 'There have been no updates for the ENCs in the date range selected');
                      return;
                    }
                  },
                  error: (error: any) => {
                    this.displayLoader = false;
                    if (error.status == HttpStatusCode.NotModified) {
                      if (this.essUploadFileService.aioEncFound && this.scsInvalidProduct && this.scsInvalidProduct.length > 0) {
                        let invalidProd = this.scsInvalidProduct.map(obj => obj.productName).join(', ');
                        this.triggerInfoErrorMessage(true, 'warning', `Invalid cells -  ${invalidProd}. <br/> There have been no updates for the ENCs in the date range selected. <br/> AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.`);
                      }
                      else if (this.scsInvalidProduct && this.scsInvalidProduct.length > 0) {
                        let invalidProd = this.scsInvalidProduct.map(obj => obj.productName).join(', ');
                        this.triggerInfoErrorMessage(true, 'warning', `Invalid cells -  ${invalidProd}. <br/> There have been no updates for the ENCs in the date range selected.`);
                      } else if (this.essUploadFileService.aioEncFound) {
                        this.triggerInfoErrorMessage(true, 'info', 'There have been no updates for the ENCs in the date range selected. <br/> AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
                      } else {
                        this.triggerInfoErrorMessage(true, 'info', 'There have been no updates for the ENCs in the date range selected');
                      }
                      return;
                    }
                    this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
                  }
                });
            }
            else {
              this.displayLoader = false;
              if (this.essUploadFileService.aioEncFound) {
                this.triggerInfoErrorMessage(true, 'error', 'No valid ENCs found. <br/>AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.');
                return;
              } else {
                this.triggerInfoErrorMessage(true, 'error', 'No valid ENCs found');
                return;
              }
            }
          },
          error: (error: any) => {
            this.displayLoader = false;
            this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
          }
        });
    }
  }

  scsProductCatalogResponse(encs: any[]) {
    if (this.essUploadFileService.exchangeSetDownloadType == 'Delta') {
      this.productUpdatesByDeltaResponse(encs);
    } else {
      this.productUpdatesByIdentifiersResponse(encs);
    }
  }

  fetchScsTokenReponse() {
    this.displayLoader = true;
    this.msalService.instance.acquireTokenSilent(this.essSilentTokenRequest).then(response => {
      this.scsProductCatalogResponse(this.validEncList);
    }, error => {
      this.msalService.instance
        .loginPopup(this.essSilentTokenRequest)
        .then(response => {
          this.scsProductCatalogResponse(this.validEncList);
        });
    });
  }

  ngOnDestroy() {
    if (this.productIdentifierSubscriber) {
      this.productIdentifierSubscriber.unsubscribe();
    }
  }
}
