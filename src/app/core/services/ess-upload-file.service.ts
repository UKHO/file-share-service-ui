import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class EssUploadFileService {
  private maxEnclimit: number;
  private validENCNumbers: string[] = new Array<string>();
  private _encFilterState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  encList: string[] = new Array<string>();

  constructor() {
    this.maxEnclimit = AppConfigService.settings['essConfig'].MaxEncLimit;
  }

  isValidEncFile(encFileTYpe: string, encList: string[]): boolean {
    if (encFileTYpe === 'text/plain' && encList[2] === ':ENC' && encList[encList.length - 1] === ':ECS') {
      return true;
    }
    else if (encFileTYpe === 'text/csv') {
      return true;
    }
    return false;
  }

  validateENCFormat(encName: string) {
    const pattern = /[A-Z]{2}[1-68][A-Z0-9]{5}$/;
    return encName.match(pattern);
  }

  extractEncsFromFile(encFileTYpe: string, processedData: string[]) {
    if (encFileTYpe === 'text/plain') {
      if (processedData[2] === ':ENC' || processedData[processedData.length - 1] === ':ECS') { // valid for txt files only
        return processedData.slice(3, processedData.length - 1);
      }
    }
    else if (encFileTYpe === 'text/csv') {

      for (let i = 0; i < processedData.length; i++) {
        let curruntRecord = (<string>processedData[i]).split(',');
        let encRecord = curruntRecord[0].trim();
        this.encList.push(encRecord);
      }
      return this.encList;
    }
    return processedData;
  }

  setValidENCs(encFileTYpe: string, encList: string[]): void {
    if (encFileTYpe === 'text/csv') {
      this.validENCNumbers = encList
        //.map((encItem: string) => encItem.substring(0, encItem.indexOf(',') > 0 ? encItem.indexOf(',') : encItem.indexOf('\t') > 0 ? encItem.indexOf('\t') : encItem.length).trim()) // split(/\t|,/))[0] fetch first 8 characters
        .filter((enc) => this.validateENCFormat(enc)) // returns valid enc's
        .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
        .filter((enc, index) => index <= this.maxEnclimit); // limit records by maxUploadRows
    }
  }

  getValidEncs(): string[] {
    return this.validENCNumbers;
  }

  getEncFileData(rawData: string): string[] {
    //fetch csv file data row by row and remove blank values from file
    return rawData.trim().split(/\r\n|\n/).filter(x => x !== "");//.map((enc: string) => enc.trim());
  }

  getEncFilterState(): BehaviorSubject<boolean> {
    return this._encFilterState;
  }

  setEncFilterState(initialEncCount: number, finalEncCount: number) {
    if (initialEncCount !== finalEncCount) {
      this._encFilterState.next(true);
    }
    else {
      this._encFilterState.next(false);
    }
  }
}
