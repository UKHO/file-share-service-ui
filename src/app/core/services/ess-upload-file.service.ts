import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EssUploadFileService {

  constructor() { }

  validate_CSVFile() { }

  validate_PermitFile() { }

  validate_ENCFormat(lst_csvENC: any) {
    let lst_validENC = [];
    for (let i = 0; i < lst_csvENC.length; i++) {

      var reg = new RegExp('[A-Z]{2}[1-68][A-Z0-9]{5}');
      var isValid = reg.test(lst_csvENC[i].encnumber);
      //var isValid=(lst_csvENC[i].value).match(reg);
      if (!isValid) {
        // this.errorMessageTitle = "There is a problem with FileSize value field";
        // this.errorMessageDescription = "Only enter numbers in the FileSize Value field. The Search will not run if characters are entered.";
        // flag = false;
      }
      else {
        lst_validENC.push(lst_csvENC[i].encnumber);
      }
    }
  }
}
