import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim';
import { PersonalInfo } from '../models/personalInfo';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call my information page

export class PersonalInfoService {

  constructor(private httpService: HttpService) { }

  // private apiUrl = environment.apiUrl;
  // private apiUrl = sessionStorage.getItem('apiUrl');
  private uri = '/nihl/api/claim';

   /*
	 * @author Deivid Mafra;
	 * @date 08/13/2020;
	 * @remarks POST service responsible for adding or updating and-user personal info based on body parameters.
   * @param claimId internal claim Id
   * @param data type of PersonalInfo
	 */
  addOrUpdatePersonalInfo = (claimId: number, data: PersonalInfo, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.post( this.uri + `/${claimId}/personalInfo`, JSON.stringify(data), httpOptions);
  }

}
