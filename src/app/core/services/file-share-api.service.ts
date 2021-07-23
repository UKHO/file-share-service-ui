import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable()
export class FileShareApiService {
    baseUrl = AppConfigService.settings['fssConfig'].apiUrl;
    private httpClient: HttpClient;
    constructor(private http: HttpClient
        , private httpBackend: HttpBackend) {
        this.httpClient = new HttpClient(httpBackend);
    }

    getSearchResult(payload: string): Observable<any> {
        if (payload === "") {
            return this.http.get(this.baseUrl + 'batch');
        }
        else {
            return this.http.get(this.baseUrl + "batch?$filter=" + encodeURIComponent(payload));
        }
    }

    getBatchAttributes(): Observable<any> {
        return this.http.get(this.baseUrl + 'attributes');
    }

    // downloadFile(filePath: string): any {
    //     return this.http.get(this.baseUrl + filePath, { responseType: 'blob' });
    // }

    downloadFile(filePath: string): any {
        var headers; headers = new HttpHeaders({
            'Access-Control-Allow-Origin': AppConfigService.settings['fssConfig'].apiUrl
        });
        return this.httpClient.get(this.baseUrl + filePath, { headers, responseType: 'blob' });
    }
}
