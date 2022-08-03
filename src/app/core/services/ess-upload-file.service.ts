import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class EssUploadFileService {
  private maxEnclimit: number;
  private validEncs: string[];
  encData: string[] = new Array<string>();
  constructor() {
    this.maxEnclimit = AppConfigService.settings['essConfig'].MaxEncLimit;
  }

  isValidEncFile(encFileType: string, encList: string[]): boolean {
    if ((encFileType === 'text/csv') || (encFileType === 'text/plain' && encList[2] === ':ENC' && encList[encList.length - 1] === ':ECS')) {
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
      if (processedData[2] === ':ENC' || processedData[processedData.length - 1] === ':ECS') { // valid for txt files only
        return processedData.slice(3, processedData.length - 1);
      }
    }
    else if (encFileType === 'text/csv') {
      return processedData.map(e => e.split(',')[0].trim());
    }
    return processedData;
  }

  setValidENCs(encList: string[]): void {
    this.validEncs = encList
      .filter((enc) => this.validateENCFormat(enc)) // returns valid enc's
      .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
      .filter((enc, index) => index < this.maxEnclimit); // limit records by MaxEncLimit    
  }

  getValidEncs(): string[] {
    return this.validEncs;
  }

  getEncFileData(encFileType: string, rawData: string): string[] {
    if (encFileType === 'text/csv') {
      //fetch csv file data row by row and remove blank values from file
      return rawData.trim().split(/\r\n|\n/).filter(x => x !== "");
    }
    return this.encData;
  }
}
