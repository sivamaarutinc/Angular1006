import { Component, OnInit } from '@angular/core';
import { ContinueAuthService } from 'src/app/services/continue-auth.service';

@Component({
  selector: 'app-auth-resume-callback',
  templateUrl: './auth-resume-callback.component.html',
  styleUrls: ['./auth-resume-callback.component.css']
})
export class AuthResumeCallbackComponent implements OnInit {

  constructor(private authResumeService: ContinueAuthService) { }

  ngOnInit() {
    this.authResumeService.completeAuthentication();
  }

}
