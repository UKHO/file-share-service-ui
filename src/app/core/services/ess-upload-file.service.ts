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

  extractEncsFromPermit(encList: string[]){
    return encList.slice(3, encList.length - 1);
  }

  setValidEncs(encList: string[]): void {
    this.validEncs = this.extractEncsFromPermit(encList)
      .map((encItem: string) => encItem.substring(0, 8)) // fetch first 8 characters
      .filter((enc) => this.validateENCFormat(enc)) // returns valid enc's
      .filter((el, i, a) => i === a.indexOf(el)) // removes duplicate enc's
      .filter((enc, index) => index < this.maxEncLimit); // limit records by maxUploadRows
      this.setEncFilterState(this.extractEncsFromPermit(encList).length,this.validEncs.length)
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

  setEncFilterState(InitialEncCount: number, FinalEncCount: number) {
    console.log(InitialEncCount , FinalEncCount);
    if (InitialEncCount !== FinalEncCount) {
      this._encFilterState.next(true)
    }
    else {
      this._encFilterState.next(false)
    }
  }
}
