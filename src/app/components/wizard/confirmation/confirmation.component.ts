import { Component, OnInit } from '@angular/core';
import { Claim } from 'src/app/models/claim';
import { TimeoutService } from 'src/app/services/timeout.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})

/* This class is responsible for Display confirmation message and redirect link of print a copy of your submission */
export class ConfirmationComponent implements OnInit {

  public claimId: number;

  constructor(
    private timeout: TimeoutService
  ) {
    this.timeout.stop();
    this.timeout.init(true);
  }

  ngOnInit() {
    this.getClaimId();
    this.clearSession();
  }

  getClaimId = (): number => {

    if (sessionStorage.getItem('claim')) {
      const claim: Claim = JSON.parse(sessionStorage.getItem('claim'));
      const date = new Date(sessionStorage.getItem('submitionDate'));
      claim.submitionDate = date;
      // sessionStorage.setItem('claimPrint', JSON.stringify(claim));
      localStorage.setItem('claimPrint', JSON.stringify(claim));
      return this.claimId = claim.claimId;
    }

  }

  clearSession = () => {
    sessionStorage.removeItem('claimId');
    sessionStorage.removeItem('referenceNumber');
    sessionStorage.removeItem('claim');
    sessionStorage.removeItem('dateOfBirth');
    sessionStorage.removeItem('submitionDate');
    // sessionStorage.removeItem('claimDocumentsList');
    // sessionStorage.removeItem('audiogramDocumentsList');
  }

}
