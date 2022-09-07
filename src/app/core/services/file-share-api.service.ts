import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class FileShareApiService {
    baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    stateManagementUrl = AppConfigService.settings['fssConfig'].stateManagementApiUrl;

    constructor(private http: HttpClient) { }

    getSearchResult(payload: string, isPagingRequest: boolean): Observable<any> {
        if (!isPagingRequest) {
            if (payload === "") {
                return this.http.get(this.baseUrl + '/batch');
            }
            else {
                return this.http.get(this.baseUrl + "/batch?$filter=" + encodeURIComponent(payload));
            }
        }
        else {
            return this.http.get(this.baseUrl + payload);
        }
    }

    getBatchAttributes(): Observable<any> {
        return this.http.get(this.baseUrl + '/attributes');
    }

    clearCookies(): Observable<any> {
        //return this.http.post(this.stateManagementUrl + '/logout', null);
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('idToken')}`
          }
       console.log('ClearcookieExpiryTme',localStorage.getItem('idToken'));
       return this.http.post(this.stateManagementUrl + '/logout', null
       , { headers : headers}
       );
    }

    refreshToken(): Observable<any> {
        return this.http.put(this.stateManagementUrl + '/tokenrefresh', null);
    }

    getAttributeSearchResult(payload: string): Observable<any> {
        return this.http.get(this.baseUrl + "/attributes/search?$filter=" + encodeURIComponent(payload));
    }
}
