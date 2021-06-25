import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from  './app-config.service';


@Injectable({providedIn: 'root' })
export class FileShareApiService {
    baseUrl= AppConfigService.settings['fssConfig'].apiUrl;
    
    constructor(private http: HttpClient) { }
    
    getSearchResult(payload: string): Observable<any>{
         if(payload === "") {
          return this.http.get( this.baseUrl + encodeURIComponent('batch'));
         }
         else {          
          return this.http.get( this.baseUrl + "batch?$filter=" + encodeURIComponent(payload));
         }
    }
}