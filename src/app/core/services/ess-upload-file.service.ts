import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EssUploadFileService {
  private validEncs: string[];
  private maxUploadRows: number;
  constructor() {
    this.maxUploadRows = AppConfigService.settings['fssConfig'].MaxUploadRows;
  }

  validateCSVFile() {}

  validatePermitFile(fileType: string, encList: string[]): boolean | Error{
    if(fileType === 'text/plain' && encList[2] === ':ENC' && encList[encList.length-1] === ':ECS'){
      return true;
    }
    return false;
  }

  validateENCFormat(encName: string) {
    const pattern = /[A-Z]{2}[1-68][A-Z0-9]{5}/;
    return encName.match(pattern);
  }

  setValidEncs(encList: string[]){
    this.validEncs = encList.map((encItem: string) => encItem.substring(0, 8)) // fetch first 8 characters
    .filter((enc) => this.validateENCFormat(enc) ) // returns valid enc's
    .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
    .filter((enc , index) => index <= this.maxUploadRows); // limit records by maxUploadRows
  }
  getValidEncs(): string[]{
    return this.validEncs;
  }
}
