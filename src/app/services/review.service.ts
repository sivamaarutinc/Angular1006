import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ReviewEmail } from '../models/reviewEmail';
import { Claim } from '../models/claim';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

// This class is responsible for API call review page

export class ReviewService {

  constructor(private httpService: HttpService) { }

  // private apiUrl = environment.apiUrl;
  // private apiUrl = sessionStorage.getItem('apiUrl');
  private uri = '/nihl/api/claim';

   /*
	 * @author Gowtham;
	 * @date 08/15/2020;
	 * @remarks PUT service responsible for send email confirmation.
   * @param claimId internal claim Id
   * @param data type of ReviewEmail
	 */
  updateClaim = (claimId: number, data: ReviewEmail, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.put( this.uri + `/${claimId}`, JSON.stringify(data), httpOptions);
  }

   /*
	 * @author Deivid Mafra;
	 * @date 08/22/2020;
	 * @remarks GET service responsible for retrieve data of an existing claim based claimId.
   * @param claimId internal claim Id
	 */
  findClaimById = (claimId: number, token: string): Observable<Claim> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpService.get( this.uri + `/${claimId}`, httpOptions);
  }
}
