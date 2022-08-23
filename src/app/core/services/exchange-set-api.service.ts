import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';


@Injectable({ providedIn: 'root' })
export class ExchangeSetApiService {
    baseUrl = AppConfigService.settings['essConfig'].apiUrl;

    constructor(private http: HttpClient) { }

    exchangeSetCreationResponse() {

    }

}