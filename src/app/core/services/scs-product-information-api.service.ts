import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { ProductCatalog } from '../models/ess-response-types';
import { EssUploadFileService } from './ess-upload-file.service';


@Injectable({ providedIn: 'root' })
export class ScsProductInformationService {
    baseUrl = AppConfigService.settings['essConfig'].apiUiUrl;

    constructor(private http: HttpClient, private essUploadFileService:EssUploadFileService) { }

    productInformationByIdentifiersResponse(requestedEncList: string[]): Observable<any>{
        return this.http.post<ProductCatalog>(this.baseUrl + '/productInformation/productIdentifiers', requestedEncList);
    }

    getProductsFromSpecificDateByScsResponse(): Observable<ProductCatalog>{
        const requestedDate = new Date(this.essUploadFileService.exchangeSetDeltaDate);
        const currentDate = new Date();
        requestedDate.setHours(currentDate.getHours());
        requestedDate.setMinutes(currentDate.getMinutes());
        requestedDate.setSeconds(currentDate.getSeconds());
        requestedDate.setMilliseconds(currentDate.getMilliseconds());
        requestedDate.setHours(requestedDate.getHours() - 23);
        requestedDate.setMinutes(requestedDate.getSeconds() + 20);
        return this.http.get<ProductCatalog>(this.baseUrl + '/ProductInformation?sinceDateTime='+ requestedDate.toUTCString());
    }
}