import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for post, get, put, delete - http request of all API.
// and error handler of API
export class HttpService {

  constructor(private http: HttpClient, private storageService: StorageService, private toastr: ToastrService, private translate: TranslateService) { }

  post(url: string, body?: any, httpOptions?: any, errorreturn = false): Observable<any> {
    const API = this.storageService.getData('apiUrl') + url;
    return this.http.post(API, body, httpOptions).map((resp: any) =>
      this.handleSuccess(resp)).catch(err => this.handleErrors(err, errorreturn));
  }

  get(url: string, headers, errorreturn = false): Observable<any> {
    const API = this.storageService.getData('apiUrl') + url;
    return this.http.get(API, headers).map((resp: any) =>
      this.handleSuccess(resp)).catch(err => this.handleErrors(err, errorreturn));
  }

  put(url: string, body?: any, headers?: any): Observable<any> {
    const API = this.storageService.getData('apiUrl') + url;
    return this.http.put(API, body, headers).map((resp: any) =>
      this.handleSuccess(resp)).catch(err => this.handleErrors(err));
  }

  delete(url: string, headers): Observable<any> {
    const API = this.storageService.getData('apiUrl') + url;
    return this.http.delete(API, headers).map((resp: any) =>
      this.handleSuccess(resp)).catch(err => this.handleErrors(err));
  }


  private handleSuccess(resp: any) {
    // if (!resp && !resp?.status) {
    //   this.toastr.error(resp.error.error, 'Error');
    // }
    return resp;
  }

  private handleErrors(err: any, errorreturn?): any {
    // let errormsg = '';
    //if (errorreturn) {
    // return throwError(err);
    // }
    //  if (!errorreturn) {
    return throwError(err);
    // this.translate.get('errors').subscribe((data: any) => {
    //   errormsg = data.commonerrormsg;
    // });
    // }
    // switch (err.error.status) {
    //   case 400:
    //   case 401:
    //   case 403:
    //   case 404:
    //   case 422:
    //   case 429:
    //   case 440:
    //   case 500:
    //     this.toastr.error(errormsg, 'Error');
    //     break;
    //   default:
    //     this.toastr.error(errormsg, 'Error');
    //     break;
    // }

  }
}
