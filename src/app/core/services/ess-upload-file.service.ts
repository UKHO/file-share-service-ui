import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EssUploadFileService {

  constructor() { }

  validate_CSVFile() { }

  validate_PermitFile() { }

  isValidENCnumber(ENCnumber: any) {
    var reg = new RegExp('[A-Z]{2}[1-68][A-Z0-9]{5}$');
    return reg.test(ENCnumber);    
  }
}
