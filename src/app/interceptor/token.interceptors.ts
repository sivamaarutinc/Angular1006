import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (sessionStorage.getItem('access_token')) {
            request = request.clone({ setHeaders: { 'Authorization': 'Bearer ' + sessionStorage.getItem('access_token') || '' } });
            return next.handle(request).pipe(catchError((err, caught) => {
                return throwError(err)
            }));
        }
        return next.handle(request).pipe(catchError((err, caught) => {
            return throwError(err)
        }));
    }

}

