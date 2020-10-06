import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ContinueAuthService } from './continue-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardServiceResume implements CanActivate {

  constructor(private authService: ContinueAuthService ) { }

  canActivate(): boolean {
      if(this.authService.isLoggedIn()) {
          return true;
      }

      this.authService.startAuthentication();
      return false;
  }
}
