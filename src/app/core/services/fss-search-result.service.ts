import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse  } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { AppConfigService } from  './app-config.service';
import { Observable, throwError } from 'rxjs';
import { FormArray } from '@angular/forms';

@Injectable({providedIn: 'root' })
export class FssSearchResultService {
    apiUrl= 'https://localhost:44343/batch'; //AppConfigService.settings['fssConfig'].apiUrl;

    constructor(private http: HttpClient) { }
    
    getSearchResult(payload: FormArray): Observable<any>{
       var jsonPaylod = JSON.stringify(payload);
       console.log("value", JSON.stringify(payload));
        let name ='John';
        console.log("apiURL", this.apiUrl);
        let token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjREQmppeDZQeXdRcl9nRFhqbVZfNUxPc3J6T3Y4ZndPVEdPeVpqWUJJdVUifQ.eyJleHAiOjE2MjQ0NDM4MzcsIm5iZiI6MTYyNDQ0MjkzNywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9tZ2lhaWRkZXZiMmMuYjJjbG9naW4uY29tLzliMjk3NjZiLTg5NmYtNDZkZi04ZjNhLTEyMmQ3YzgyMWIwMS92Mi4wLyIsInN1YiI6ImM2YjgzMzBjLTVkOWYtNGRlNC1hOWE2LTIzOWM5MTQ1NDg0YyIsImF1ZCI6IjRhYTVkYWJjLWJmNTQtNDRlOC04OTI2LWQzZTNlYTE3MjQyMiIsImFjciI6ImIyY18xYV9zaWduaW5fc3BhIiwibm9uY2UiOiJhZmZlMTE0OC1lMjRlLTQ0YTUtOWI3NS04NmUyYjhkODM0ZDIiLCJpYXQiOjE2MjQ0NDI5MzcsImF1dGhfdGltZSI6MTYyNDQ0MjkzNiwib2lkIjoiYzZiODMzMGMtNWQ5Zi00ZGU0LWE5YTYtMjM5YzkxNDU0ODRjIiwic2lnbkluTmFtZSI6InJhc2hpMTQ3NDguMSIsIm5hbWUiOiJSYXNoaSBNaXNocmEiLCJnaXZlbl9uYW1lIjoiUmFzaGkiLCJmYW1pbHlfbmFtZSI6Ik1pc2hyYSIsImV4dGVuc2lvbl9zZWN0b3IiOiJJbmZvcm1hdGlvbiBhbmQgQ29tbXVuaWNhdGlvbiIsImV4dGVuc2lvbl9jb21wYW55TmFtZSI6Ik1hc3RlayIsImVtYWlsIjoicmFzaGkxNDc0OEBtYXN0ZWsuY29tIn0.JZvukkibgLhib-Wg7k7dk7JXpxyitCaptDmRjcpNNtssj6NqInjsUSROxerGTTpfgftfqs0vmW5riJPiViuWqMtzyZm9lXV_rk_KRvXdpCXUTgakJa_0S52L7SXlVqRDe7ScMS6hPPJR2nVgAK_Ll99w_SlGSpVS8WZrLKQTFAi52m3VhHOsTUw-xumbTxcKF473mxh4HbPooF19IEKsB-HBXQ9GaFBLxwaCwTb4c_Cuj01niRlfDoyIE66sASuvd5jYUXq3v7XImyHUV9DkA8KM_i6pp-Lltr2dJpcXtdcZBab6YfQ-83Zd-UF7Z5Zh0ltRO2sVAza_mKW-ZjENXg';
        const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json');
        
        // const searchParams = new HttpParams();
        // const searchParams = new HttpParams();
        // for(let result of jsonPaylod){
        //     console.log("result", result)
        // }

       
        // const searchParams = new HttpParams({
        //     fromObject: {
        //         limit: '1',
        //         start:'0',
        //         $filter: "$file(owner)"+" "+"eq"+" "+"${name}"
        //     }
        // });
        return this.http.get(this.apiUrl,
              {
                headers: headers,
               // params: searchParams
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