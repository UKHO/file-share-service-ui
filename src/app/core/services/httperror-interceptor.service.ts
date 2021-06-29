import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root' })
export class HttpErrorInterceptorService implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                const errorMessage = this.setError(error);
                console.log(error);
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
          if(error.status!==0){
            errorMessage = error.error.message;
          }
          
        }
        return errorMessage;
      }
    
}
