import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse  } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppConfigService } from  './app-config.service';


@Injectable({providedIn: 'root' })
export class FssSearchResultService {
    baseUrl= AppConfigService.settings['fssConfig'].apiUrl;
    
    constructor(private http: HttpClient) { }
    
    getSearchResult(payload: string): Observable<any>{
          
         const searchParams = new HttpParams()
                      .set('params', payload);
        return this.http.get( this.baseUrl+encodeURIComponent('batch'),
              {
                params: searchParams
            })
            .pipe(catchError(this.handleError));
    }
  
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
      }
    
}