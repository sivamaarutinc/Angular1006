import { Component,  OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/services/claim.service';
import { Router } from '@angular/router';
import { ContinueClaimDTO } from 'src/app/DTOs/continueClaimDTO';
import { CreateClaimDTO } from 'src/app/DTOs/createClaimDTO';
import { Claim } from 'src/app/models/claim';
import { CommunicationLanguage } from 'src/app/enums/communication-language';
import { ValidationService } from 'src/app/services/validation.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { TimeoutService } from 'src/app/services/timeout.service';
import { environment } from 'src/environments/environment';


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
@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

// This class is responsible for User can create/starting a new Submission using email address and date of bith
export class ClaimComponent implements OnInit {

  public isGradual: boolean = false;
  public isSudden: boolean = false;
  public today = new Date();
  public minYear = new Date();
  public datevalue: any;
  public validdateOfBirth: boolean = true;
  public iscommonerrormsg: boolean = false;
  

  continueClaimForm = new FormGroup({
    continueEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
    dateOfBirth: new FormControl('', Validators.required),
    referenceNumber: new FormControl(''),
  });

  constructor(
    private claimService: ClaimService,
    private router: Router,
    private validationService: ValidationService,
    private timeout: TimeoutService,
  ) { }

  ngOnInit() {
    this.setMinDate();
    sessionStorage.removeItem('claimId');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('referenceNumber');
    sessionStorage.removeItem('claim');
    sessionStorage.removeItem('claimPrint');
    sessionStorage.removeItem('dateOfBirth');

    sessionStorage.removeItem('component');
    sessionStorage.removeItem('employmentData');
    sessionStorage.removeItem('audiogramDocumentsList');
    sessionStorage.removeItem('claimDocumentsList');
    sessionStorage.removeItem('client_id');
    localStorage.removeItem('audiogramDocumentsList');
    localStorage.removeItem('claimDocumentsList');

    this.timeout.stop();
   
  }

  setMinDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    this.minYear = date;
  }

  /*
  * @author Deivid Mafra;
  * @date 08/13/2020;
  * @remarks Method responsible for creating a claim using the end-user email. The status will be always "PENDING" at this moment.
  * It retrieves the new reference number from the back-end and storage it in the session storage.
  */
  // createClaim = () => {
  //   if (this.newClaimForm.valid) {
  //     const lang = sessionStorage.getItem('currentLang');
  //     let claim: CreateClaimDTO = {
  //       email: this.newClaimForm.get('email').value,
  //       status: "PENDING",
  //       communicationLanguage: lang.includes('en') ? CommunicationLanguage.EN : CommunicationLanguage.FR
  //     }

  //     this.claimService.createClaim(claim).subscribe(
  //       (res: Claim) => {
  //         console.log(res);
  //         sessionStorage.setItem('claimId', res.claimId.toString());
  //         sessionStorage.setItem('referenceNumber', res.referenceNumber);
  //         this.router.navigate(['/induced-hearing-loss-form']);
  //       },
  //       error => {
  //         console.log(error);
  //         console.log("error in create claim");
  //       }
  //     )
  //   } else {
  //     this.validationService.validateAllFormFields(this.newClaimForm);
  //   }
  // }

  /*
  * @author Deivid Mafra;
  * @date 08/13/2020;
  * @remarks Method responsible for resuming a claim using the email and the reference number of an existing claim.
  * It retrieves the correspondent Id from the back-end and storage the Id in the session storage.
  */
  createOrResumeClaim = () => {
    if (this.continueClaimForm.valid) {
      this.iscommonerrormsg = false;
      let dob = _moment(this.continueClaimForm.get('dateOfBirth').value).format('DD MMM YYYY');

      sessionStorage.setItem('dateOfBirth', dob);
      // sessionStorage.setItem('dateOfBirth', this.continueClaimForm.get('dateOfBirth').value);

      if (this.continueClaimForm.get('referenceNumber').value !== '') {

        const continueClaimDTO: ContinueClaimDTO = {
          continueEmail: this.continueClaimForm.get('continueEmail').value,
          dateOfBirth: _moment(this.continueClaimForm.get('dateOfBirth').value).format('YYYY-MM-DD'),
          referenceNumber: this.continueClaimForm.get('referenceNumber').value
        };

        const token = sessionStorage.getItem('access_token');
        this.claimService.findClaimByRefAndEmail(continueClaimDTO.continueEmail, continueClaimDTO.dateOfBirth, continueClaimDTO.referenceNumber, 'PENDING', token).subscribe(
          (res: Claim) => {

            if (res) {

              sessionStorage.setItem('claim', JSON.stringify(res));
              this.router.navigate(['/induced-hearing-loss-form']);
            } else {

            }
          },
          error => {

            this.iscommonerrormsg = true;
            document.getElementById('commonerrormsgid').focus();
          }
        );
      } else if (this.isGradual === true) {
        const lang = sessionStorage.getItem('currentLang');

        const claim: CreateClaimDTO = {
          communicationLanguage: lang.includes('en') ? CommunicationLanguage.EN : CommunicationLanguage.FR,
          email: this.continueClaimForm.get('continueEmail').value,
          status: 'PENDING',
          dateOfBirth: _moment(this.continueClaimForm.get('dateOfBirth').value).format('YYYY-MM-DD'),
        };

        const token = sessionStorage.getItem('access_token');
        this.claimService.createClaim(claim, token).subscribe(
          (res: Claim) => {
            sessionStorage.setItem('claimId', res.claimId.toString());
            sessionStorage.setItem('referenceNumber', res.referenceNumber);
            this.router.navigate(['/induced-hearing-loss-form']);
          },
          error => {
            this.iscommonerrormsg = true;
            document.getElementById('commonerrormsgid').focus();
          }
        );
      } else {
        console.log('sample message asking to select Gradual or insert a reference number');
      }

    } else {
      this.validationService.validateAllFormFields(this.continueClaimForm);
    }
    // this.router.navigate(['/induced-hearing-loss-form']);
  }

  checkGradual = () => {
    this.isGradual = true;
    this.isSudden = false;
  }

  checkSudden = () => {
    this.isGradual = false;
    this.isSudden = true;
  }


  isFieldValid(form: FormGroup, field: string, splchk = null) {
    if (splchk === null) {
      return !form.get(field).valid && form.get(field).touched;
    } else {
      if (splchk) {
        return !form.get(field).valid && form.get(field).touched && !form.get(field).value;
      } else {
        return !form.get(field).valid && form.get(field).touched && form.get(field).value;
      }
    }
  }

  isFieldTouched(form: FormGroup, field: string, splchk = null) {
    if (form.get(field).touched) {
      return this.isFieldValid(form, field, splchk);
    }
  }


  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field)
    };
  }

  focusOutonDate(value) {
    this.datevalue = value.length;
    this.validdateOfBirth = this.IsValidDate(value);
  }

  checkDate(value) {
    this.datevalue = value.length;

    if (value.length === 3) {
      const character3 = value.charAt(2);
      const isnum3 = /^\d+$/.test(character3);
      if (isnum3) {
        this.continueClaimForm.get('dateOfBirth').setValue('');
      }
    }

    this.validdateOfBirth = this.IsValidDate(value);
  }

  IsValidDate(value) {
    const d = value;
    console.log(d);

    const day = d.substring(0, 2);
    const d1 = d.substring(2, 3);
    const month = d.substring(3, 6).toUpperCase();
    const d2 = d.substring(6, 7);
    const year = d.substring(7);
    const yearnum = year * 1;
    if (year.length !== 4) {
      return false;
    }
    if (isNaN(yearnum)) {
      return false;
    }
    if (yearnum < 0 || yearnum > 9999) {
      return false;
    }
    const daynum = day * 1;
    if (isNaN(daynum)) {
      return false;
    }
    if (month === 'JAN' || month === 'MAR' || month === 'MAY' || month === 'MAI' || month === 'JUL' || month === 'AUG' || month === 'AO�' || month === 'OCT' || month === 'DEC' || month === 'D�C') {
      if (daynum < 1 || daynum > 31) {
        return false;
      }
    }
    else {
      if (month === 'APR' || month === 'AVR' || month === 'JUN' || month === 'SEP' || month === 'NOV') {
        if (daynum < 1 || daynum > 30) {
          return false;
        }
      }
      else {
        if (month === 'FEB' || month === 'F�V') {
          if ((year % 4) === 0) {
            if (daynum < 1 || daynum > 29) {
              return false;
            }
          }
          else {
            if (daynum < 1 || daynum > 28) {
              return false;
            }
          }
        }
        else {
          return false;
        }
      }
    }
    return true;
  }
}
