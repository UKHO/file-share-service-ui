import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse  } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from  './app-config.service';
import { Observable, throwError } from 'rxjs';

@Injectable({providedIn: 'root' })
export class FssSearchResultService {
    apiUrl= AppConfigService.settings['fssConfig'].apiUrl;

    constructor(private http: HttpClient) { }
    
    getSearchResult(payload: string): Observable<any>{
       var jsonPaylod = JSON.stringify(payload);
       console.log("value", JSON.stringify(payload));
        let name ='John';
        console.log("apiURL", this.apiUrl);
        let token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjREQmppeDZQeXdRcl9nRFhqbVZfNUxPc3J6T3Y4ZndPVEdPeVpqWUJJdVUifQ.eyJleHAiOjE2MjQ0NDg4OTgsIm5iZiI6MTYyNDQ0Nzk5OCwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9tZ2lhaWRkZXZiMmMuYjJjbG9naW4uY29tLzliMjk3NjZiLTg5NmYtNDZkZi04ZjNhLTEyMmQ3YzgyMWIwMS92Mi4wLyIsInN1YiI6ImM2YjgzMzBjLTVkOWYtNGRlNC1hOWE2LTIzOWM5MTQ1NDg0YyIsImF1ZCI6IjRhYTVkYWJjLWJmNTQtNDRlOC04OTI2LWQzZTNlYTE3MjQyMiIsImFjciI6ImIyY18xYV9zaWduaW5fc3BhIiwibm9uY2UiOiI3ZjFiNTNiNC1hNTM1LTQ0ODEtODk4Yy0xOWI4NGE5MjhhOGUiLCJpYXQiOjE2MjQ0NDc5OTgsImF1dGhfdGltZSI6MTYyNDQ0Nzk5Nywib2lkIjoiYzZiODMzMGMtNWQ5Zi00ZGU0LWE5YTYtMjM5YzkxNDU0ODRjIiwic2lnbkluTmFtZSI6InJhc2hpMTQ3NDguMSIsIm5hbWUiOiJSYXNoaSBNaXNocmEiLCJnaXZlbl9uYW1lIjoiUmFzaGkiLCJmYW1pbHlfbmFtZSI6Ik1pc2hyYSIsImV4dGVuc2lvbl9zZWN0b3IiOiJJbmZvcm1hdGlvbiBhbmQgQ29tbXVuaWNhdGlvbiIsImV4dGVuc2lvbl9jb21wYW55TmFtZSI6Ik1hc3RlayIsImVtYWlsIjoicmFzaGkxNDc0OEBtYXN0ZWsuY29tIn0.Y-meAmIO8gMMzzRCdeE-L4bcXjToHE0bGiE7juVXJCMdsgZ2KOL5nyCQBo9tawuOCQptS3qEr7AEA0C1V7piuoj8ZmzmgSHUmP7kavUPShQcsTmppBYH0O7qx59ksN3U__WBDyd4qN3t_VW0zFVBsq3M1t1ONCH8GeYQhq528vcsSiK6g_sZaGawttQrPkfWa4SVmbekq80Mz45C4DZRAz_OXV-eWXitJXJDodP29FhKSMCmpOafp68THlWBEUhIFYkKwMrp55GrZZvvKT8hXdtRtSV5cNlRXcYwEb7FAJVM6w7cK2b2AVOnEak2Uv9LksqsFf5nDAblqUEqyj2m1A';
          const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json');
        
         const searchParams = new HttpParams()
                      .set('params', payload);
         console.log("searchParams",searchParams);
        return this.http.get(this.apiUrl,
              {
                headers: headers,
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