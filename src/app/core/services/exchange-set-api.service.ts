import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { EssUploadFileService } from './ess-upload-file.service';


@Injectable({ providedIn: 'root' })
export class ExchangeSetApiService {
    baseUrl = AppConfigService.settings['essConfig'].apiUrl;

    constructor(private http: HttpClient , private essUploadFileService: EssUploadFileService) { }

    exchangeSetCreationResponse(requestedEncList: string[]): Observable<any>{
        return this.http.post<any>(this.baseUrl + '/productData/productIdentifiers', requestedEncList);
    }
}