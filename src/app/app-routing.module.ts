import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimComponent } from './components/claim/claim.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { PrintComponent } from './components/wizard/print/print.component';
import { RouteGuardService } from './services/route-guard.service';
import { AuthLogoutComponent } from './components/authentication/auth-logout/auth-logout.component';
import { AuthCallbackComponent } from './components/authentication/auth-callback/auth-callback.component';
import { AuthResumeCallbackComponent } from './components/authentication/auth-resume-callback/auth-resume-callback.component';
import { RouteGuardServiceResume } from './services/route-guard-resume.service';
import { LandingComponent } from './components/landing/landing.component';
import { TimeOutComponent } from './components/wizard/time-out/time-out.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  //  {                                         // uncomment it to use outside b2c
  //    path: 'en/nihl',                        // uncomment it to use outside b2c
  //    component: ClaimComponent               // uncomment it to use outside b2c
  //  },                                        // uncomment it to use outside b2c
  {
    path: 'induced-hearing-loss-form',
    component: WizardComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'induced-hearing-loss-form-resume',
    component: WizardComponent,
    canActivate: [RouteGuardServiceResume]
  },
  {
    path: 'fr',
    component: AppComponent,
  },
  {
    path: 'auth-resume',
    component: AppComponent,
  },
  {
    path: 'auth-newclaim',
    component: AppComponent,
  },
  {
    path: 'printerpage',
    component: PrintComponent,
  },
  {                                           // comment it to use outside b2c
    path: '',                                 // comment it to use outside b2c
    component: AppComponent,                  // comment it to use outside b2c
  },                                          // comment it to use outside b2c

  // {                                        // uncomment it to use inside b2c
  //   path: '',                              // uncomment it to use inside b2c
  //   redirectTo: 'en/nihl',                // uncomment it to use inside b2c
  //   pathMatch: 'full'                      // uncomment it to use inside b2c
  // },                                       // uncomment it to use inside b2c
  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  },
  {
    path: 'auth-resume-callback',
    component: AuthResumeCallbackComponent
  },
  {
    path: 'en/nihl/logout',
    component: AuthLogoutComponent
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'time-out',
    component: TimeOutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
