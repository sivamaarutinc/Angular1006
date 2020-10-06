import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PastEmployerInfo } from '../models/pastEmployerInfo';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim';
import { PredefinedToolList } from '../models/predefinedToolList';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call Employement page

export class PastEmploymentInfoService {

  constructor(private httpService: HttpService) { }

  // private apiUrl = environment.apiUrl;
  // private apiUrl = sessionStorage.getItem('apiUrl');
  private uriClaim = '/nihl/api/claim';
  private uriTools = '/nihl/api/tools';
  private uriSuffix = 'employmentInfo/pastEmploymentInfo/';

  /*
  * @author Deivid Mafra;
  * @date 08/16/2020;
  * @remarks POST service responsible for adding and-user past employment info based on body parameters.
  * @param claimId internal claim Id
  * @param data type of PastEmployerInfo
  */
  addPastEmploymentInfo = (claimId: number, data: PastEmployerInfo, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.post( this.uriClaim + `/${claimId}/${this.uriSuffix}`, JSON.stringify(data), httpOptions);
  }

  /*
  * @author Deivid Mafra;
  * @date 08/17/2020;
  * @remarks GET service responsible for retrieve the pre-defined tool list.
  */
  getAllTools = (token: string): Observable<Array<PredefinedToolList>> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.get(this.uriTools, httpOptions);
  }

  /*
  * @author Deivid Mafra;
  * @date 08/18/2020;
  * @remarks DELETE service responsible for deleting the specific past employer info by calimId and employerId.
  */
  deletePastEmploymentInfo = (claimId: number, employerId: number, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.delete(this.uriClaim + `/${claimId}/${this.uriSuffix}${employerId}`, httpOptions);
  }

  /*
  * @author Deivid Mafra;
  * @date 08/16/2020;
  * @remarks POST service responsible for adding and-user past employment info based on body parameters.
  * @param claimId internal claim Id
  * @param data type of PastEmployerInfo
  */

  updatePastEmploymentInfo = (claimId: number, id: number, data: PastEmployerInfo, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.put(this.uriClaim + `/${claimId}/${this.uriSuffix}/${id}`, JSON.stringify(data), httpOptions);
  }


}
