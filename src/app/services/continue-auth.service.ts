import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from './claim.service';
import { ContinueClaimDTO } from '../DTOs/continueClaimDTO';
import { Claim } from '../models/claim';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContinueAuthService {
  private user: User = null;
  private manager: UserManager;
  private authority: string;
  private lang: string;
  private urlLang: string;

  constructor(private storageService:StorageService,private router: Router, private claimService: ClaimService, private route: ActivatedRoute) {

    // alert('window.location.href ' + window.location.href);
    let urlLang = window.location.href.split("/");
    // alert('urlLang ' +  urlLang)
    this.urlLang = urlLang[3];
    this.manager = this.getManager();
}


  getClientSettings() {
    let ret: UserManagerSettings = null;

    ret = {
      // authority: authorityUrl,
      // client_id: environment.client_id,
      // redirect_uri: environment.redirect_resume_uri,
      // post_logout_redirect_uri: environment.post_logout_uri,
      // scope: environment.scope,
      // ui_locales: this.lang,
      // response_type: 'code',
      // filterProtocolClaims: true,
      // loadUserInfo: false

      authority: this.storageService.getData('authorityUrlContinue'),
      client_id:this.storageService.getData('client_id'),
      redirect_uri:this.storageService.getData('redirect_resume_uri'),
      post_logout_redirect_uri: this.storageService.getData('post_logout_uri'),
      scope: this.storageService.getData('scope'),
      ui_locales:this.storageService.getData('currentLang'),
      response_type: 'code',
      filterProtocolClaims: true,
      loadUserInfo: false
    };
    // ret = {
    //   authority: authorityUrl,
    //   client_id: sessionStorage.getItem('client_id'),
    //   redirect_uri: sessionStorage.getItem('redirect_resume_uri'),
    //   post_logout_redirect_uri:  sessionStorage.getItem('post_logout_uri'),
    //   scope: sessionStorage.getItem('scope'),
    //   ui_locales: this.lang,
    //   response_type: 'code',
    //   filterProtocolClaims: true,
    //   loadUserInfo: false
    // };

    this.manager=  new UserManager(ret);
  }

  getManager() {
    let ret: UserManagerSettings = null;

    ret = {
      
      authority: this.storageService.getData('authorityUrlContinue'),
      client_id:this.storageService.getData('client_id'),
      redirect_uri:this.storageService.getData('redirect_resume_uri'),
      post_logout_redirect_uri: this.storageService.getData('post_logout_uri'),
      scope: this.storageService.getData('scope'),
      ui_locales:this.storageService.getData('currentLang'),
      response_type: 'code',
      filterProtocolClaims: true,
      loadUserInfo: false
    };
    return new UserManager(ret);
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
    // console.log('startAuthentication at' + this.manager.settings.authority);
    this.storageService.removeDataBeforeB2C();
    return this.manager.signinRedirect();
  }

  startLogout() {
    // console.log('startAuthentication at' + this.manager.settings.authority);
    return this.manager.signoutRedirect();
  }




  completeAuthentication(): Promise<void> {

    // alert('completeAuthentication from resume')
    // console.log(
    //   'completeAuthentication called ' + this.manager.settings.authority
    // );
    
    if(this.manager)
    return this.manager
      .signinRedirectCallback()
      .then((user) => {
        this.user = user;
        sessionStorage.setItem('access_token', this.user.access_token);

        const { email, dob, refNo } = this.decodeToken(this.user.access_token);
        const continueClaimDTO: ContinueClaimDTO = {
          continueEmail: email,
          dateOfBirth: dob,
          referenceNumber: refNo
        };
        // const continueClaimDTO: ContinueClaimDTO = {
        //   continueEmail: 'mail@mail.com',
        //   dateOfBirth: '1999-01-01',
        //   referenceNumber: 'XGZJZLID'
        // };
        this.claimService.findClaimByRefAndEmail(continueClaimDTO.continueEmail, continueClaimDTO.dateOfBirth, continueClaimDTO.referenceNumber, 'PENDING', this.user.access_token).subscribe(
          (res: Claim) => {
            if (res) {
              sessionStorage.setItem('claim', JSON.stringify(res));
              sessionStorage.setItem('referenceNumber',continueClaimDTO.referenceNumber);
              this.router.navigate(['/induced-hearing-loss-form']);
            } else {
              sessionStorage.setItem('apiErrorCode', 'NIHLA002');
              this.router.navigateByUrl('/landing');
            }
          },error => {
            if(error.error && error.error.errorCd){
              sessionStorage.setItem('apiErrorCode', error.error.errorCd);
              this.router.navigateByUrl('/landing');
            }
            }
          );
        })
        .catch((error) => {
          // alert('completeAuthentication error callback: ' + error);
          const authority = environment.authorityUrlStart;
          
          //this.manager = this.getManager();
          //this.router.navigate(['/auth-resume']);
          sessionStorage.setItem('apiErrorCode', 'NIHLA012');
          this.router.navigateByUrl('/landing');
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
