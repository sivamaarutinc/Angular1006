import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CreateClaimDTO } from '../DTOs/createClaimDTO';
import { Claim } from '../models/claim';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call of Claim page
export class ClaimService {
  
  private uri = '/nihl/api/claim';
  constructor(private httpService: HttpService,) {
    //  this.apiUrl = sessionStorage.getItem('apiUrl');
     
   
   }

  // private apiUrl = environment.apiUrl;
 

  /*
  * @author Deivid Mafra;
  * @date 08/13/2020;
  * @remarks POST service responsible for claim creation based on body parameters.
  * @param data type of CreateClaimDTO
  */
  createClaim = (data: CreateClaimDTO, token: any): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + token
      }),
    };
   
    
    return this.httpService.post(this.uri, JSON.stringify(data), httpOptions, true);
    // return this.http.post<Claim>(this.apiUrl + this.uri, JSON.stringify(data), httpOptions);
  }


  /*
  * @author Deivid Mafra;
  * @date 08/13/2020;
  * @remarks GET service responsible for retrieve data of an existing claim based on query parameters.
  * @param email End-user email used before to create a claim
  * @param dateOfBirth End-user date of birth used before to create a claim
  * @param referenceNumber String generated at the moment of claim creation
  * @param status Initial status for a claim will be always "PENDING"
  */
  findClaimByRefAndEmail = (email: string, dateOfBirth: string, referenceNumber: string, status: string = 'PENDING', token: any): Observable<Claim> => {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + token
      }),
      params: new HttpParams().append('dateOfBirth', dateOfBirth).append('email', email).append('referenceNumber', referenceNumber).append('status', status)
    };
    return this.httpService.get(this.uri, httpOptions,true).map((data:any)=>{console.log(data); return data});
    // return this.http.get<Claim>(this.apiUrl + this.uri, httpOptions);
  }

}
