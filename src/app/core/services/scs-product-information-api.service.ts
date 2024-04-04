import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { ProductCatalog } from '../models/ess-response-types';
import { EssUploadFileService } from './ess-upload-file.service';


@Injectable({ providedIn: 'root' })
export class ScsProductInformationApiService {
    baseUrl = AppConfigService.settings['essConfig'].apiUiUrl;

    constructor(private http: HttpClient, private essUploadFileService:EssUploadFileService) { }

    scsProductIdentifiersResponse(requestedEncList: string[]): Observable<any>{
        return this.http.post<ProductCatalog>(this.baseUrl + '/productInformation/productIdentifiers', requestedEncList);
    }

    getProductsFromSpecificDateByScsResponse(): Observable<ProductCatalog>{
        const requestedDate = new Date(this.essUploadFileService.exchangeSetDeltaDate);
        const currentDate = new Date();
        requestedDate.setHours(currentDate.getHours());
        requestedDate.setMinutes(currentDate.getMinutes());
        requestedDate.setSeconds(currentDate.getSeconds());
        requestedDate.setMilliseconds(currentDate.getMilliseconds());
        requestedDate.setHours(requestedDate.getHours() - 23);//By default system will use the date 23 hours earlier than the date set by the user.
        return this.http.get<ProductCatalog>(this.baseUrl + '/ProductInformation?sinceDateTime='+ requestedDate.toUTCString());
    }
}