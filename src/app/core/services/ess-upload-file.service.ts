import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EssUploadFileService {
  private validEncs: string[];
  private maxEncLimit: number;
  private _encFilterState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {
    this.maxEncLimit = AppConfigService.settings['essConfig'].MaxEncLimit;
  }

  validateCSVFile() { }

  isValidEncFile(encFileTYpe: string, encList: string[]): boolean {
    if (encFileTYpe === 'text/plain' && encList[2] === ':ENC' && encList[encList.length - 1] === ':ECS') {
      return true;
    }
    return false;
  }

  validateENCFormat(encName: string) {
    const pattern = /[A-Z]{2}[1-68][A-Z0-9]{5}$/;
    return encName.match(pattern);
  }

  extractEncsFromFile(processedData: string[]){
    if(processedData[2] === ':ENC' || processedData[processedData.length - 1] === ':ECS'){ // valid for txt files only
      return processedData.slice(3, processedData.length - 1);
    } // add condition for csv here if any
    return processedData;
  }

  setValidEncs(encList: string[]): void {
    this.validEncs = encList
      .map((encItem: string) => encItem.substring(0, 8)) // fetch first 8 characters
      .filter((enc) => this.validateENCFormat(enc)) // returns valid enc's
      .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
      .filter((enc, index) => index < this.maxEncLimit); // limit records by maxUploadRows
  }

  getValidEncs(): string[] {
    return this.validEncs;
  }

  getEncFileData(rawData: string): string[] {
    return rawData.trim().split('\n').map((enc: string) => enc.trim());
  }

  getEncFilterState(): BehaviorSubject<boolean> {
    return this._encFilterState;
  }

  setEncFilterState(initialEncCount: number, finalEncCount: number) {
    if (initialEncCount > finalEncCount) {
      this._encFilterState.next(true);
    }
    else {
      this._encFilterState.next(false);
    }
  }
}
