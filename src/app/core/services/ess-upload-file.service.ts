import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EssUploadFileService {
  private validEncs: string[];
  private selectedEncs: string[];
  private maxEncLimit: number;
  private showInfoMessage = false;
  constructor() {
    this.selectedEncs = [];
    this.maxEncLimit = AppConfigService.settings['essConfig'].MaxEncLimit;
  }

  isValidEncFile(encFileType: string, encList: string[]): boolean {
    if ((encFileType === 'text/csv') ||
      (encFileType === 'text/plain' &&
      encList[2] === ':ENC' &&
      encList[encList.length - 1] === ':ECS'
    )) {
      return true;
    }
    return false;
  }

  validateENCFormat(encName: string) {
    const pattern = /[A-Z]{2}[1-68][A-Z0-9]{5}$/;
    return encName.match(pattern);
  }

  extractEncsFromFile(encFileType: string, processedData: string[]) {
    if (encFileType === 'text/plain') {
      // valid for txt files only
      return processedData
        .slice(3, processedData.length - 1).filter(x => x !== "")
        .map((encItem: string) => encItem.substring(0, 8));
    }
    else if (encFileType === 'text/csv') {
      return processedData.map(e => e.split(',')[0].trim()).filter(x => x !== "");
    }
    return processedData;
  }

  setValidENCs(encList: string[]): void {
    this.validEncs = encList
      .filter((enc) => this.validateENCFormat(enc)) // returns valid enc's
      .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
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

  set infoMessage(visibility: boolean){
    this.showInfoMessage = visibility;
  }

}