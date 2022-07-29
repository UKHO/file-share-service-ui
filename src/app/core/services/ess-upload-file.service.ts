import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EssUploadFileService {

  constructor() { }

  validate_CSVFile()
  {}

  validate_PermitFile()
  {}

  validate_ENCFormat(encName: string)
  {
    let pattern = /[A-Z]{2}[1-68][A-Z0-9]{5}/;
    return encName.match(pattern);
  }
}
