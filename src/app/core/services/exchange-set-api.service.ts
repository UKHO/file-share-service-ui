import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { ProductVersionRequest } from '../models/ess-response-types';


@Injectable({ providedIn: 'root' })
export class ExchangeSetApiService {
    baseUrl = AppConfigService.settings['essConfig'].apiUrl;

    constructor(private http: HttpClient) { }

    exchangeSetCreationResponse(requestedEncList: string[]): Observable<any>{
        return this.http.post<any>(this.baseUrl + '/productData/productIdentifiers', requestedEncList);
    }

    exchangeSetCreationForDeltaResponse(requestedEncList: ProductVersionRequest[]): Observable<any>{
        return this.http.post<any>(this.baseUrl + '/productData/productVersions', requestedEncList);
    }
}