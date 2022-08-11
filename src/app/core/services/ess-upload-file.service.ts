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
    this.validEncs = ['AU210130', 'AU220130', 'AU220150', 'AU314128', 'AU411129', 'AU412129', 'AU415128', 'AU416145', 'AU421116', 'AU424150', 'AU426113', 'AU432115', 'AU439144', 'AU439146', 'AU5BTB01', 'AU5CTN01', 'AU5DAM02', 'AU5MEL01', 'AU5PHE01', 'AU5PTL01', 'AU5SYD01', 'AU6BTB01', 'BR221010', 'BR221070', 'BR321200', 'BR321400', 'BR400221', 'BR401507', 'BR441012', 'CA270390', 'CA271031', 'CA271032', 'CA271033', 'CA271060', 'CA271105', 'CA271106', 'CA271107', 'CA271108', 'CA370016', 'CA370381', 'CA370382', 'CA376665', 'CA379115', 'CA471013', 'CA471035', 'CA471036', 'CA471110', 'CA479155', 'CA579146', 'CA579156', 'CA579246', 'CL2LL070', 'CL3BB010', 'CL3LL075', 'CL5BB020', 'CL5VA019', 'CN383001', 'CN384001', 'CN384002', 'CN483101', 'CN483102', 'CN484101', 'CN484203', 'CN484211', 'CN484212', 'CN484213', 'CN484214', 'CN484215', 'CN484216', 'CN484218', 'CN484219', 'CN484220', 'CN484301', 'CN583103', 'CN583104', 'CN583105', 'CN583106', 'CN583107', 'CN584102', 'CN584224', 'CN584225', 'CN584226', 'CN584227', 'CN584228', 'CN584229', 'CN584230', 'CN584231', 'CN584232', 'CN584233', 'CN584234', 'CN584235', 'CN584236', 'CN584243', 'CN584244', 'CN584245', 'CN584247', 'CN584248', 'CN584249', 'CN584307', 'CO400517'];
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

  getSelectedENCs(): string[]{
    return this.selectedEncs;
  }

  addSelectedEnc(enc: string): void{
    this.selectedEncs = [...this.selectedEncs, enc];
  }

  removeSelectedEncs(enc: string): void{
    this.selectedEncs = this.selectedEncs.filter((item) => item !== enc);
  }

  clearSelectedEncs(){
    this.selectedEncs = [];
  }
}
