import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { ProductCatalog } from '../models/ess-response-types';


@Injectable({ providedIn: 'root' })
export class ScsProductInformationService {
    baseUrl = AppConfigService.settings['essConfig'].apiUiUrl;

    constructor(private http: HttpClient) { }

    productUpdatesByIdentifiersResponse(requestedEncList: string[]): Observable<any>{
        return this.http.post<ProductCatalog>(this.baseUrl + '/productInformation/productIdentifiers', requestedEncList);
    }
}