import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class FileShareApiService {
    baseUrl = AppConfigService.settings['fssConfig'].apiUrl;

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
        return this.http.get(this.baseUrl + '/logout');
    }

    refreshToken(): Observable<any> {
        return this.http.get(this.baseUrl + '/refreshToken');
    }

    isTokenExpired() {
        var flag = false;
        if (localStorage['claims'] !== undefined) {
            const claims = JSON.parse(localStorage['claims']);
            //To retrieve the current date time
            const currentDateTime = new Date().toISOString();
            //To retrieve the date time when idtoken was received(at the time of user login)
            const expiresOn = new Date(1000 * claims['exp']).toISOString();
            if (expiresOn < currentDateTime) {
                flag = true;
            }
        }
        return flag
    }

}
