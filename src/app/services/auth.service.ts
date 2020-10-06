import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ClaimService } from './claim.service';
import { CreateClaimDTO } from '../DTOs/createClaimDTO';
import { CommunicationLanguage } from '../enums/communication-language';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _moment from 'moment';
import { RouteGuardService } from './route-guard.service';
import { B2c } from '../models/b2c';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MMM/YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User = null;
  private manager: UserManager;
  private authority: string;
  private lang: string;
  private urlLang: string;
  private envB2c: B2c;

  constructor(private storageService:StorageService,private router: Router, private claimService: ClaimService, private httpService: HttpService) {

    // this.getEnvData();

    // this.httpService.get('http://localhost:3000/getconfig', {}).subscribe(
    //   (envData)=>{
    //     // console.log('envData from auth.Service', envData);

    //     this.envB2c.authorityUrlStart = envData.authorityUrlStart;
    //     this.envB2c.authorityUrlContinue = envData.authorityUrlContinue;
    //     this.envB2c.client_id = envData.client_id;
    //     this.envB2c.redirect_uri = envData.redirect_uri;
    //     this.envB2c.redirect_resume_uri = envData.redirect_resume_uri;
    //     this.envB2c.post_logout_uri = envData.post_logout_uri;
    //     this.envB2c.scope = envData.scope;
    //     this.authority = envData.authorityUrlStart;
        
    //   })
    //   setTimeout(()=>{
    //     console.log('this.envB2c', this.envB2c);
    //   },3000)
      // this.authority = this.envB2c.authorityUrlStart;


    // let urlLang = window.location.href.split("/");
    // this.urlLang = urlLang[3];


    // const url = window.location.href.toLowerCase();
    // if (url.indexOf('lang=en') !== -1) {
    //   window.sessionStorage.setItem('currentLang', 'en');
    //   this.lang = 'en';
    // } else if (url.indexOf('lang=fr') !== -1 || this.urlLang === 'fr') {
    //   window.sessionStorage.setItem('currentLang', 'fr');
    //   this.lang = 'fr';
    // } else {
    //   if (window.sessionStorage.getItem('currentLang') === 'en') {
    //     this.lang = 'en';
    //   } else if (window.sessionStorage.getItem('currentLang') === 'fr') {
    //     this.lang = 'fr';
    //   } else {
    //     this.lang = 'en';
    //   }
    // }

    // this.authority = environment.authorityUrlStart;
    // this.authority = window.sessionStorage.getItem('authorityUrlStart');
    // this.manager = new UserManager(this.getClientSettings());
    this.manager = this.getManager();
    
  }

  // getEnvData = ()=>{

  //   this.httpService.get('http://localhost:3000/getconfig', {}).subscribe(
  //     (envData)=>{
  //       console.log('envData from auth.Service', envData);

  //       this.envB2c.authorityUrlStart = envData.authorityUrlStart;
  //       this.envB2c.authorityUrlContinue = envData.authorityUrlContinue;
  //       this.envB2c.client_id = envData.client_id;
  //       this.envB2c.redirect_uri = envData.redirect_uri;
  //       this.envB2c.redirect_resume_uri = envData.redirect_resume_uri;
  //       this.envB2c.post_logout_uri = envData.post_logout_uri;
  //       this.envB2c.scope = envData.scope;
  //   })

  //   console.log('this.envB2c', this.envB2c);
  // }

  getManager() {

    let ret: UserManagerSettings = null;

    ret = {
      authority: this.storageService.getData('authorityUrlStart'),
      client_id:this.storageService.getData('client_id'),
      redirect_uri:this.storageService.getData('redirect_uri'),
      post_logout_redirect_uri: this.storageService.getData('post_logout_uri'),
      scope: this.storageService.getData('scope'),
      ui_locales: this.storageService.getData('currentLang'),
      response_type: 'code',
      filterProtocolClaims: true,
      loadUserInfo: false
    };
    return new UserManager(ret);
  }

  getClientSettings() {

    let ret: UserManagerSettings = null;

    ret = {
      authority: this.storageService.getData('authorityUrlStart'),
      client_id:this.storageService.getData('client_id'),
      redirect_uri:this.storageService.getData('redirect_uri'),
      post_logout_redirect_uri: this.storageService.getData('post_logout_uri'),
      scope: this.storageService.getData('scope'),
      ui_locales: this.storageService.getData('currentLang'),
      response_type: 'code',
      filterProtocolClaims: true,
      loadUserInfo: false
    };

    // ret = {
    //   authority: authorityUrl,
    //   client_id: this.envB2c.client_id,
    //   redirect_uri: this.envB2c.redirect_uri,
    //   post_logout_redirect_uri:  this.envB2c.post_logout_uri,
    //   scope: this.envB2c.scope,
    //   ui_locales: this.lang,
    //   response_type: 'code',
    //   filterProtocolClaims: true,
    //   loadUserInfo: false
    // };
    
    // ret = {
    //   authority: authorityUrl,
    //   client_id: sessionStorage.getItem('scope'),
    //   redirect_uri: sessionStorage.getItem('scope'),
    //   post_logout_redirect_uri:  sessionStorage.getItem('scope'),
    //   scope: sessionStorage.getItem('scope'),
    //   ui_locales: this.lang,
    //   response_type: 'code',
    //   filterProtocolClaims: true,
    //   loadUserInfo: false
    // };
    this.manager=  new UserManager(ret);
    // return ret;
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getEmailAddress(): string {
    return this.user.profile.emails[0];
  }

  getAccessToken(): string {
    return this.user.access_token;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    // alert('startAuthentication at' + this.manager.settings.authority);
    this.storageService.removeDataBeforeB2C();
    return this.manager.signinRedirect();
  }

  startLogout() {
    // console.log('startAuthentication at' + this.manager.settings.authority);
    return this.manager.signoutRedirect();
  }



  completeAuthentication(): Promise<void> {
    // alert(
    //   'completeAuthentication called ' + this.manager.settings.authority
    // );
    if(this.manager)
    return this.manager
      .signinRedirectCallback()
      .then((user) => {
        this.user = user;
        const lang = sessionStorage.getItem('currentLang');
        sessionStorage.setItem('access_token', this.user.access_token);

        /*decode token here */
        const { email, dob } = this.decodeToken(this.user.access_token);
        /*decode token here */

        const claim: CreateClaimDTO = {
          communicationLanguage: lang.includes('en') ? CommunicationLanguage.EN : CommunicationLanguage.FR,
          email,
          status: 'PENDING',
          dateOfBirth: dob
        };

        this.claimService.createClaim(claim, this.user.access_token).subscribe(
          (res: any) => {
            sessionStorage.setItem('claim', JSON.stringify(res));

            let dob = _moment(res.dateOfBirth).format('DD MMM YYYY');
            sessionStorage.setItem('dateOfBirth', dob);
            

            // sessionStorage.setItem('dateOfBirth', res.dateOfBirth);
            sessionStorage.setItem('claimId', res.claimId.toString());
            sessionStorage.setItem('referenceNumber', res.referenceNumber);
            // alert('$$$$$$$$$$');
            this.router.navigate(['/']);
          }
        );

        // setTimeout(() => {
        //     this.router.navigate(['/'])
        //   }, 5000);

      })
      .catch((error) => {
        const authority = environment.authorityUrlStart;
        this.manager = this.getManager();
        this.router.navigate(['/auth-callback']);
      })
      .finally(() => {
      });
  }

  decodeToken = (token: string) => {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  completeLogout(): Promise<void> {

    return this.manager
      .signoutRedirectCallback()
      .then(() => {

      })
      .catch((error) => {
      })
      .finally(() => {
        if (window.sessionStorage.getItem('currentLang') === 'fr') {
          window.location.href = 'https://www.wsib.ca/fr';
        } else {
          window.location.href = 'https://www.wsib.ca/';
        }
      });
  }

}
