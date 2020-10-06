import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { ConsoleReporter } from 'jasmine';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ContinueAuthService } from './continue-auth.service';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  /*uncomment this block of code to work without b2c */
  // constructor(private router: Router,private httpService: HttpService,private http: HttpClient) { }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
  //   const referenceNumber = sessionStorage.getItem('referenceNumber');
  //   const claim = sessionStorage.getItem('claim');
  //   if (referenceNumber || claim) {
  //     return true;
  //   }
  //   else {
  //     return this.router.parseUrl('');
  //   }
  // }

  /* comment this block of code to work with b2c */
  constructor(private authService: AuthService, private authResume: ContinueAuthService, private http: HttpClient,private httpService: HttpService ) { }

  canActivate(): boolean {

    if(this.authService.isLoggedIn() || this.authResume.isLoggedIn()) {
          return true;
      }

      this.authService.startAuthentication();
      return false;
  }


  getConfig() {
    console.log('before getConfig');
    // return this.http.get('http://localhost:3000/getconfig', {})
    return this.http.get('/getconfig', {});
    }
}