import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retryWhen, delay, takeWhile } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';


@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptorService implements HttpInterceptor {

  essBaseUrl = AppConfigService.settings['essConfig'].apiUrl;
  maxRetries = AppConfigService.settings['essConfig'].maxRetries;
  initialDelayMs = AppConfigService.settings['essConfig'].initialDelayMs;
  retryCount = 0;

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request)
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            takeWhile((err: HttpErrorResponse, index) => {
              if (request.url.includes(this.essBaseUrl) &&
                        (this.retryCount < this.maxRetries - 1)  &&
                        (err.status != 400 && err.status != 415)) {
                this.retryCount = index;
              }
              else {
                return false;
              }
              return true;
            }),
            delay(Math.pow(2, this.retryCount) * this.initialDelayMs)
          )
        ),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.setError(error);
          return throwError(error.error);
        })
      );
  }

  setError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occured!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status !== 0) {
        errorMessage = error.error.message;
      }

    }
    return errorMessage;
  }

}


