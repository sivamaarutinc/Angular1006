import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim';
import { HealthCareProviderInfo } from '../models/healthCareProviderInfo';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call of Health care page

export class HealthCareProviderInfoService {

  constructor(private httpService: HttpService) { }

  // private apiUrl = environment.apiUrl;
  
  private uri = '/nihl/api/claim';

   /*
	 * @author Gowtham;
	 * @date 08/15/2020;
	 * @remarks POST service responsible for adding or updating health care provider info based on body parameters.
   * @param claimId internal claim Id
   * @param data type of HealthCareProviderInfo
	 */
  addOrUpdateHealthCareProviderInfo = (claimId: number, data: HealthCareProviderInfo, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.post(this.uri + `/${claimId}/healthCareProviderInfo`, JSON.stringify(data), httpOptions);
  }
}
