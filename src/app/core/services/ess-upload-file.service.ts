import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EssUploadFileService {
  private validEncs: string[];
  private MaxEncLimit: number;
  constructor() {
    this.MaxEncLimit = AppConfigService.settings['essConfig'].MaxEncLimit;
  }

  validateCSVFile() {}

  isValidEncFile(encFileTYpe: string, encList: string[]): boolean{
    if(encFileTYpe === 'text/plain' && encList[2] === ':ENC' && encList[encList.length-1] === ':ECS'){
      return true;
    }
    return false;
  }

  validateENCFormat(encName: string) {
    const pattern = /[A-Z]{2}[1-68][A-Z0-9]{5}$/;
    return encName.match(pattern);
  }

  setValidEncs(encList: string[]): void{
    this.validEncs = encList
    .map((encItem: string) => encItem.substring(0, 8)) // fetch first 8 characters
    .filter((enc) => this.validateENCFormat(enc) ) // returns valid enc's
    .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
    .filter((enc , index) => index < this.MaxEncLimit); // limit records by maxUploadRows
  }

  getValidEncs(): string[]{
    return this.validEncs;
  }

  getEncFileData(rawData: string): string[]{
    return rawData.trim().split('\n').map((enc: string) => enc.trim());
  }
}
