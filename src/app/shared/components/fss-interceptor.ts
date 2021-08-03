import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FssInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage['idToken'];
    var headers;
      headers = new HttpHeaders({
        'Authorization': 'Bearer ' + idToken
      });
    return next.handle(httpRequest.clone({ headers, withCredentials: true }));
  }
}