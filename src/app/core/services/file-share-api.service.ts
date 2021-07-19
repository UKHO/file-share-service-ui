import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class FileShareApiService {
    baseUrl = AppConfigService.settings['fssConfig'].apiUrl;

    constructor(private http: HttpClient) { }

    getSearchResult(payload: string,isPagingRequest : boolean): Observable<any> {
        if(!isPagingRequest)
        {
            if (payload === "") {
                return this.http.get(this.baseUrl + '/batch');
            }
            else {
                return this.http.get(this.baseUrl + "/batch?$filter=" + encodeURIComponent(payload));
            }

        }
        else{
            return this.http.get(this.baseUrl + payload);
        }
       
    }

    getBatchAttributes(): Observable<any> {
        return this.http.get(this.baseUrl + '/attributes');
    }

}
