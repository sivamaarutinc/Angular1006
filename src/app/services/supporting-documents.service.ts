import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { Documents } from '../models/documets';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call of supporting document page

export class SupportingDocumentsService {

  constructor(private httpService: HttpService) { }

  // private apiUrl = environment.apiUrl;
  // private apiUrl = sessionStorage.getItem('apiUrl');
  private uriScan = '/scan';
  private uri = '/nihl/api/claim';

  scanFile = (file, name, token:string): Observable<string> => {
    // const requestOptions: object = {
    //   responseType: 'text'
    // };


    const httpOptions = {
      headers: new HttpHeaders({
        responseType: 'text'
      }),
    };

    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    return this.httpService.post( this.uriScan, formData, httpOptions);
  }


 

  createDocument = (claimId: number, data: FormData, token: string) => {
    
    const httpOptions = {
      headers: new HttpHeaders({
      }),
    };

    return this.httpService.post( this.uri + `/${claimId}/documents`, data, httpOptions,true);
  }

  deleteDocument = (claimId: number, documentId: number, token: string): Observable<any> => {
    // const requestOptions: object = {
    //   responseType: 'text'
    // };

    const httpOptions = {
      headers: new HttpHeaders({
        responseType: 'text'
      }),
    };

    return this.httpService.delete( this.uri + `/${claimId}/documents/${documentId}`, httpOptions );
  }
}
