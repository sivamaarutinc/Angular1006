import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim';
import { EmploymentInfo } from '../models/employmentInfo';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call employment info

export class EmploymentInfoService {

  constructor(private httpService: HttpService) { }

  // private apiUrl = environment.apiUrl;
  
  private uri = '/nihl/api/claim';

   /*
	 * @author Deivid Mafra;
	 * @date 08/13/2020;
	 * @remarks POST service responsible for adding or updating and-user employment info based on body parameters.
   * @param claimId internal claim Id
   * @param data type of EmploymentInfo
	 */
  addOrUpdateEmploymentInfo = (claimId: number, data: EmploymentInfo, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.post(this.uri + `/${claimId}/employmentInfo`, JSON.stringify(data), httpOptions);
  }

}
