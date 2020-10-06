
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from './services/http.service';
import { RouteGuardService } from './services/route-guard.service';
import { Router,ActivatedRoute} from '@angular/router';
import { AuthService } from './services/auth.service';
import { ContinueAuthService } from './services/continue-auth.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


// parent component of the app. This class is responsible for check lenguage of the app when init app
export class AppComponent {

  constructor(private continueAuthService: ContinueAuthService, private storageService: StorageService, private authService: AuthService, private route: Router, private activatedRoute: ActivatedRoute, private translateService: TranslateService, private routeGuard: RouteGuardService) {

    translateService.addLangs(['en', 'fr']);
    if (window.navigator.language === 'fr' || sessionStorage.getItem('currentLang') === 'fr') {
      translateService.setDefaultLang('fr');
    } else {
      translateService.setDefaultLang('en');
    }

    this.getConfig();
  }
  title = 'NIHLwebapp';

  getConfig() {
    console.log('data from guard empty>>>>');

    this.routeGuard.getConfig().subscribe((data: any) => {
      console.log('data from guard>>>>', data);
      window.sessionStorage.setItem('apiUrl', data.apiUrl);
      window.sessionStorage.setItem('authorityUrlContinue', data.authorityUrlContinue);
      window.sessionStorage.setItem('authorityUrlStart', data.authorityUrlStart);
      window.sessionStorage.setItem('client_id', data.client_id);
      window.sessionStorage.setItem('post_logout_uri', data.post_logout_uri);
      window.sessionStorage.setItem('redirect_resume_uri', data.redirect_resume_uri);
      window.sessionStorage.setItem('redirect_uri', data.redirect_uri);
      window.sessionStorage.setItem('scope', data.scope);
      window.sessionStorage.setItem('timeOut', data.timeOut);
      this.authService.getClientSettings();
      this.continueAuthService.getClientSettings();
      console.log('**************************'+this.route.url);
      this.activatedRoute.queryParams.subscribe(params => {
        if(params['lang'])
          window.sessionStorage.setItem('currentLang',params['lang'])

      });
      if(this.route.url.startsWith('/fr')){
        window.sessionStorage.setItem('currentLang','fr')
      }
      setTimeout(() => {
        if (data.apiUrl)
          //set language for /fr and continue

          if(this.route.url.startsWith('/auth-resume')){
            this.route.navigate(['induced-hearing-loss-form-resume']);
          }else if(this.route.url.startsWith('/auth-newclaim')){
            this.route.navigate(['induced-hearing-loss-form']);
          }else if(this.route.url =='/'){
            this.route.navigate(['induced-hearing-loss-form']);
          }else if(this.route.url =='/fr'){
            this.route.navigate(['induced-hearing-loss-form']);
          }
      }, 500);
    })

  }
//=======
  // getConfig(){
  //   this.routeGuard.getConfig().subscribe((envData)=>{

  //   sessionStorage.setItem('config', 'true');
  //   sessionStorage.setItem('apiUrl', envData.apiUrl);
  //   sessionStorage.setItem('authorityUrlStart', envData.authorityUrlStart);
  //   sessionStorage.setItem('authorityUrlContinue', envData.authorityUrlContinue);
  //   sessionStorage.setItem('client_id', envData.client_id);
  //   sessionStorage.setItem('redirect_uri', envData.redirect_uri);
  //   sessionStorage.setItem('redirect_resume_uri', envData.redirect_resume_uri);
  //   sessionStorage.setItem('post_logout_uri', envData.post_logout_uri);
  //   sessionStorage.setItem('scope', envData.scope);
  //   sessionStorage.setItem('timeOut', envData.timeOut);

  //   })
  // }

  //getConfig() {
  // console.log('before getConfig');
  // return this.httpService.get('http://localhost:3000/getconfig', {});

  //this.httpService.get('http://localhost:3000/getconfig', {}).subscribe(
  //(envData)=>{
  //console.log('envData from auth.Service', envData);

  //    sessionStorage.setItem('config', 'true');
  //  sessionStorage.setItem('apiUrl', envData.apiUrl);
  //sessionStorage.setItem('authorityUrlStart', envData.authorityUrlStart);
  //sessionStorage.setItem('authorityUrlContinue', envData.authorityUrlContinue);
  //sessionStorage.setItem('client_id', envData.client_id);
  //sessionStorage.setItem('redirect_uri', envData.redirect_uri);
  //sessionStorage.setItem('redirect_resume_uri', envData.redirect_resume_uri);
  //sessionStorage.setItem('post_logout_uri', envData.post_logout_uri);
  //sessionStorage.setItem('scope', envData.scope);
  //sessionStorage.setItem('timeOut', envData.timeOut);
  //})

  //console.log('sessionStorage.getItem Authority>>>>>>>>>', sessionStorage.getItem('authorityUrlStart'));

  //}
  //>>>>>>> master
}