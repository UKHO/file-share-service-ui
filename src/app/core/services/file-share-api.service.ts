import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn: 'root' })
export class FileShareApiService {
    baseUrl = AppConfigService.settings['fssConfig'].apiUrl;

    constructor(private http: HttpClient, private msalService: MsalService) { }

    getSearchResult(payload: string, isPagingRequest: boolean): Observable<any> {
        if (this.checkTokenExpiry()) {
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
        else {
            return of([]);
        }

    }

    getBatchAttributes(): Observable<any> {
        return this.http.get(this.baseUrl + '/attributes');
    }

    checkTokenExpiry() {
        var flag = true;
        const claims = JSON.parse(localStorage['claims']);
        //To retrieve the current date time
        const currentDateTime = new Date().toISOString();
        //To retrieve the date time when idtoken was received(at the time of user login)
        const expiresOn = new Date(1000 * claims['exp']).toISOString();
        if (expiresOn < currentDateTime) {
            this.msalService.loginPopup().subscribe(response => {
                localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
                const idToken = response.idToken;
                localStorage.setItem('idToken', idToken);
            });
            flag = false;
        }
        return flag
    }

}
