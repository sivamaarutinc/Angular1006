import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ReferenceNumberInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (sessionStorage.getItem('referenceNumber')) {
      request = request.clone({ setHeaders: { 'referenceNumber': sessionStorage.getItem('referenceNumber') || '' } });
      return next.handle(request).pipe(catchError((err, caught) => {
        return throwError(err)
      }));
    }
    return next.handle(request).pipe(catchError((err, caught) => {
      return throwError(err)
    }));
  }
}
