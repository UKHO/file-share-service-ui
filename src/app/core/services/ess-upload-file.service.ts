import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ExchangeSetDetails, NotReturnedProduct, Product, ProductCatalog } from '../models/ess-response-types';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EssUploadFileService {
  private _scsProductResponse: ProductCatalog | undefined;
  private _scsProducts: Product[];
  private _scsInvalidProducts: NotReturnedProduct[];
  private validEncs: string[];
  private selectedEncs: Product[];
  private maxEncLimit: number;
  private maxEncSelectionLimit: number;
  private showInfoMessage = false;
  private notifySingleEnc: Subject<boolean> = new Subject<boolean>();
  private exchangeSetDetails: ExchangeSetDetails;
  private estimatedTotalSize: number;
  private configAioEncList: string[];
  public aioEncFound: boolean;

  constructor() {
    this.selectedEncs = [];
    this.maxEncLimit = AppConfigService.settings['essConfig'].MaxEncLimit;
    this.maxEncSelectionLimit = Number.parseInt(AppConfigService.settings['essConfig'].MaxEncSelectionLimit, 10);
    this.configAioEncList = AppConfigService.settings["essConfig"].aioExcludeEncs;
  }

  isValidEncFile(encFileType: string, encList: string[]): boolean {
    if ((encFileType === 'text/csv') ||
      (encFileType === 'text/plain' &&
        encList[2] === ':ENC' &&
        encList[encList.length - 1] === ':ECS'
      ) || encFileType === 'application/vnd.ms-excel') {
      return true;
    }
    return false;
  }

  validateENCFormat(encName: string) {
    const pattern = /^[a-zA-Z0-9]{2}[1-68][a-zA-Z0-9]{5}$/;
    return encName.match(pattern);
  }

  excludeAioEnc(encName: string) {
    return !this.configAioEncList.includes(encName);
  }

  extractEncsFromFile(encFileType: string, processedData: string[]) {
    if (encFileType === 'text/plain') {
      // valid for txt files only
      return processedData
        .slice(3, processedData.length - 1).filter(x => x !== "")
        .map((encItem: string) => encItem.substring(0, 8));
    }
    else if (encFileType === 'text/csv' || encFileType === 'application/vnd.ms-excel') {
      return processedData.map(e => e.split(',')[0].trim()).filter(x => x !== "");
    }
    return processedData;
  }

  setValidENCs(encList: string[]): void {
    this.aioEncFound = false;
    this.validEncs = encList
      .filter((enc) => this.validateENCFormat(enc)) // returns valid enc's
      .map((enc) => enc.toUpperCase())// applies Upper Case to ENC
      .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's


    let validEncsExAio = this.validEncs
      .filter((enc) => this.excludeAioEnc(enc)); //exclude AIO list

    if (validEncsExAio.length < this.validEncs.length) {
      this.aioEncFound = true;
    }

    this.validEncs = validEncsExAio
      .filter((enc, index) => index < this.maxEncLimit); // limit records by MaxEncLimit   
  }

  getValidEncs(): string[] {
    return this.validEncs;
  }

  getEncFileData(rawData: string): string[] {
    return rawData
      .trim()
      .split('\n')
      .map((enc: string) => enc.trim());
  }

  get infoMessage() {
    return this.showInfoMessage;
  }

  set infoMessage(visibility: boolean) {
    this.showInfoMessage = visibility;
  }

  getSelectedENCs(): Product[] {
    return this.selectedEncs;
  }

  addSelectedEnc(enc: Product): void {
    this.selectedEncs = [...this.selectedEncs, enc];
  }

  removeSelectedEncs(enc: string): void {
    this.selectedEncs = this.selectedEncs.filter((item: Product) => item.productName !== enc);
  }

  clearSelectedEncs() {
    this.selectedEncs = [];
  }

  getMaxEncLimit() {
    return this.maxEncLimit;
  }

  setValidSingleEnc(signleValidEnc: string) {
    this.validEncs = [];
    this.validEncs.push(signleValidEnc.toUpperCase());
  }

  setExchangeSetDetails(exchangeSetDetails: ExchangeSetDetails) {
    this.exchangeSetDetails = exchangeSetDetails;

  }

  getExchangeSetDetails(): ExchangeSetDetails {
    return this.exchangeSetDetails;
  }

  addSingleEnc(signleValidEnc: string) {
    this.validEncs.push(signleValidEnc.toUpperCase());
    this.notifySingleEnc.next(true);
  }

  getNotifySingleEnc() {
    return this.notifySingleEnc;
  }

  checkMaxEncLimit(encList: string[]): boolean {
    if (encList.length < this.maxEncLimit) {
      return false;
    }
    else {
      return true;
    }
  }


  addAllSelectedEncs() {
    const maxEncSelectionLimit = this.maxEncSelectionLimit > this.validEncs.length ? this.validEncs.length : this.maxEncSelectionLimit;
    this.selectedEncs = [...this.scsProducts.slice(0, maxEncSelectionLimit)];
  }

  getEstimatedTotalSize(): string {
    this.estimatedTotalSize = 0;
    for (let selectedEnc of this.selectedEncs) {
      this.estimatedTotalSize = this.estimatedTotalSize + selectedEnc.fileSize;
    }
    return (ConvertBytesToMegabytes(this.estimatedTotalSize)).toFixed(2) + ' MB';
  }

   get scsProductResponse() : ProductCatalog | undefined{
    return this._scsProductResponse;
  }

   set scsProductResponse(scsProductResponse: ProductCatalog | undefined){
     this._scsProductResponse = scsProductResponse;
   } 

  get scsProducts(): Product[] {
    return this._scsProducts;
  }

   set scsProducts(products: Product[]){
      this._scsProducts = products;
   }

   get scsInvalidProducts() : NotReturnedProduct[]{
    return this._scsInvalidProducts;
   }

   set scsInvalidProducts(NotReturnedProduct: NotReturnedProduct[]){
      this._scsInvalidProducts = NotReturnedProduct;
   }

  clearData() {
    this.validEncs = [];
    this.scsInvalidProducts = [];
    this.scsProductResponse = undefined;
    this.clearSelectedEncs();
  }
}
function ConvertBytesToMegabytes(estimatedTotalSize: number) {
  let byteSize = 1024;
  return (estimatedTotalSize / byteSize) / byteSize;
}
