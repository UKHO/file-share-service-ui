import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class FssInterceptor implements HttpInterceptor {

  constructor(private msalService:MsalService) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var requestObj;
    if (httpRequest.url.includes("ess")) {
      requestObj = {
      scopes: [
        "https://MGIAIDTESTB2C.onmicrosoft.com/ExchangeSetService/Request"
      ],
    };
  } else {
      requestObj = {
      scopes: [
        "https://MGIAIDTESTB2C.onmicrosoft.com/FileShareServiceAPI/Public"
      ],
    };
  }
  this.getAccessToken(httpRequest, requestObj, next);
  return next.handle(httpRequest);
  }

  getAccessToken(httpRequest: HttpRequest<any>,scopeObject: any, next: HttpHandler): Observable<HttpEvent<any>>{
    this.msalService.acquireTokenSilent(scopeObject).subscribe((response) => {
      var headers = new HttpHeaders({
            'Authorization': 'Bearer ' + response.accessToken
          });
          return next.handle(httpRequest.clone({ headers, withCredentials: true }));
      });
      return next.handle(httpRequest);
    }
}