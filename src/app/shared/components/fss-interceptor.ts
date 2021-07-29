import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FssInterceptor implements HttpInterceptor {

  constructor(private msalService: MsalService) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const claims = JSON.parse(localStorage['claims']);
    const idToken = localStorage['idToken'];

    //To retrieve the current date time
    const currentDateTime = new Date().toISOString();

    //To retrieve the date time when idtoken was received(at the time of user login)
    const expiresOn = new Date(1000 * claims['exp']).toISOString();

    //Pass the valid IDToken in Authrization header
    //Check whether IDToken is expired by comparing expiresOn time with currentDateTime
    //in case of token expiry, user will be asked to log in and new token and claims will be set 
    var headers;
    if (expiresOn < currentDateTime) {
      this.msalService.loginPopup().subscribe(response => {
        localStorage.setItem('claims', JSON.stringify(response.idTokenClaims));
        const idToken = response.idToken;
        localStorage.setItem('idToken', idToken);
        headers = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken,
          'Access-Control-Allow-Origin': AppConfigService.settings['fssConfig'].apiUrl
        });
      });
    } else {
      headers = new HttpHeaders({
        'Authorization': 'Bearer ' + idToken,
        'Access-Control-Allow-Origin': AppConfigService.settings['fssConfig'].apiUrl
      });
    }
    return next.handle(httpRequest.clone({ headers, withCredentials: true }));
  }
}