import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ReviewEmail } from 'src/app/models/reviewEmail';
import { CommunicationLanguage } from 'src/app/enums/communication-language';
import { Status } from 'src/app/enums/status';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReviewService } from 'src/app/services/review.service';
import { MatStepper } from '@angular/material/stepper';
import { PersonalInfo } from 'src/app/models/personalInfo';
import { HealthCareProviderInfo } from 'src/app/models/healthCareProviderInfo';
import { EmploymentInfo } from 'src/app/models/employmentInfo';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { PastEmployerInfo } from 'src/app/models/pastEmployerInfo';
import { Documents } from 'src/app/models/documets';
import { Claim } from 'src/app/models/claim';
import { ValidationService } from 'src/app/services/validation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { timeout } from 'rxjs/operators';
import { NgRecaptcha3Service } from 'ng-recaptcha3'

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
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

// This class is responsible for the Review of user information which submited in all past forms submission.  email confirmation and agreement submit
export class ReviewComponent implements OnInit, OnChanges {

  public confirmationError: string;
  public referenceNumber: string;
  public personalInformation: PersonalInfo;
  public healthInfo: HealthCareProviderInfo;
  public employInfo: EmploymentInfo;
  public pastEmployInfo: PastEmployerInfo[];
  public claimDocumentsList: Documents[];
  public newclaimDocumentsList: [];
  public audiogramDocumentsList: [];
  public languagelist: any = [];
  public claimEmail: string;
  public iscommonerrormsg: boolean = false;
  public isrecaptcha = environment.isrecaptcha;
  isCaptcha: boolean = false;
  isSubmit: boolean = false;

  @Input() public claimId: number;
  @Input() private currentPosition: MatStepper;
  @Input() public checkChanges: number;


  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() setTabindex: EventEmitter<number> = new EventEmitter();

  @ViewChild("recaptcha", { static: true }) recaptchaElement: ElementRef;

  reviewForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}')]),
    signature: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \u00C0-\u00FF]*$')]),
  });

  constructor(
    private validationService: ValidationService,
    private reviewService: ReviewService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private recaptcha3: NgRecaptcha3Service
  ) { }

  ngOnChanges(): void {
    setTimeout(() => {
      this.getClaim();
    }, 1000)

  }

  ngOnInit(): void {
    // this.addRecaptchaScript();
    if (this.isrecaptcha) {
      this.recaptcha3.init(environment.siteKeyCaptcha);
    }
    this.cdr.detectChanges();
  }

  public ngOnDestroy() {
    this.recaptcha3.destroy();
  }

  @Input() set resultofSaveonExit(value: string) {
    this.saveData(value);
  }

  saveData(name) {
    if (sessionStorage.getItem('component') === '4') {
    }
  }

  addRecaptchaScript() {
    window["grecaptchaCallback"] = () => { this.renderReCaptch(); };
    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptch(); return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      js.async = false; js.defer = true;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "recaptcha-jssdk", this);
  }

  renderReCaptch() {
    window["grecaptcha"].render(this.recaptchaElement.nativeElement, {
      sitekey: environment.siteKeyCaptcha,
      callback: response => { this.getResponceCapcha(response); }
    });
  }

  getResponceCapcha(captchaResponse: string) {
    const secretKey = environment.secretKeyCaptcha;
    const url = '/recaptcha?token=' + captchaResponse;
    // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Credentials': 'true',
    //     'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    //   }),
    // };
    // this.http.get('http://localhost:3000/getconfig', {})
    this.httpClient.post(url, null).subscribe((res: any) => {
      if (res?.success) {
        this.isCaptcha = true;
        this.onsubmitClaim();
      }
      else {
        this.isCaptcha = false;
      }
      // window['grecaptcha'].reset();
    });
  }


  /*
  * @author Deivid Mafra;
  * @date 08/22/2020;
  * @remarks Method responsible for retrieve data of an existing claim on sessionStorage.
  * @param claimId
  */
  getClaim = () => {

    const claim: Claim = JSON.parse(sessionStorage.getItem('claim'));

    this.referenceNumber = claim?.referenceNumber;
    this.claimEmail = claim?.email;
    this.personalInformation = claim?.personalInformation;
    this.healthInfo = claim?.healthCareProviderInformation;

    this.employInfo = claim?.employmentInformation;

    this.pastEmployInfo = this.employInfo ? claim.employmentInformation.pastEmploymentInformationList.sort((a, b) => (a.employmentStartDate > b.employmentStartDate) ? -1 : 1) : null;

    this.newclaimDocumentsList = JSON.parse(localStorage.getItem('claimDocumentsList'));
    this.audiogramDocumentsList = JSON.parse(localStorage.getItem('audiogramDocumentsList'));
    this.claimDocumentsList = claim?.claimDocumentsList;

    this.reviewForm.get('email').setValue(claim?.email);


    if (claim?.personalInformation && claim?.personalInformation.primaryTelephoneNumber) {
      const phone1splitted = this.personalInformation.primaryTelephoneNumber.split(' ');
      this.personalInformation.primaryTelephoneNumber = phone1splitted[1];
    }
    if (claim?.personalInformation && claim?.personalInformation.secondaryTelephoneNumber) {
      const phone2splitted = this.personalInformation.secondaryTelephoneNumber.split(' ');
      this.personalInformation.secondaryTelephoneNumber = phone2splitted[1];
    }
    if (claim?.personalInformation && claim?.personalInformation.provinceOrState) {
      this.personalInformation.provinceOrState = this.personalInformation.provinceOrState;
    }
    if (claim?.personalInformation && claim?.personalInformation.country) {
      this.personalInformation.country = this.personalInformation.country;
    }
    // console.log( this.employInfo.currentEmployerPhoneNumber)
    //     if (claim?.employmentInformation && claim?.employmentInformation.currentEmployerPhoneNumber) {
    //       const retirementDate = this.employInfo.currentEmployerPhoneNumber.split(' ');
    //       this.employInfo.currentEmployerPhoneNumber = retirementDate[1];
    //     }


    /*format dates */
    if (claim?.personalInformation && claim?.personalInformation.dateOfBirth) {
      this.personalInformation.dateOfBirth = _moment(this.personalInformation.dateOfBirth).format('DD MMM YYYY');
    }

    if (claim?.healthCareProviderInformation && claim?.healthCareProviderInformation.dateOfFirstAudiogram) {
      this.healthInfo.dateOfFirstAudiogram = _moment(this.healthInfo.dateOfFirstAudiogram).format('DD MMM YYYY');
    }
    if (claim?.healthCareProviderInformation && claim?.healthCareProviderInformation.entAppointmentDate) {
      this.healthInfo.entAppointmentDate = _moment(this.healthInfo.entAppointmentDate).format('DD MMM YYYY');
    }
    if (claim?.healthCareProviderInformation && claim?.healthCareProviderInformation.hearingLossNoticedYear) {
      this.healthInfo.hearingLossNoticedYear = _moment(this.healthInfo.hearingLossNoticedYear).format('YYYY');
    }
    if (claim?.healthCareProviderInformation && claim?.healthCareProviderInformation.hearingAidUsageDate) {
      this.healthInfo.hearingAidUsageDate = _moment(this.healthInfo.hearingAidUsageDate).format('DD MMM YYYY');
    }


    if (claim?.employmentInformation && claim?.employmentInformation.retirementDate) {
      this.employInfo.retirementDate = _moment(this.employInfo.retirementDate).format('DD MMM YYYY');
    }
    if (claim?.employmentInformation && claim?.employmentInformation.selfEmpStartDate) {
      this.employInfo.selfEmpStartDate = _moment(this.employInfo.selfEmpStartDate).format('DD MMM YYYY');
    }
    if (claim?.employmentInformation && claim?.employmentInformation.selfEmpEndDate) {
      this.employInfo.selfEmpEndDate = _moment(this.employInfo.selfEmpEndDate).format('DD MMM YYYY');
    }


  }


  editMyInfo() {
    this.currentPosition.selectedIndex = 0;
  }
  editHealth() {
    this.currentPosition.selectedIndex = 1;
  }
  editeditEmploy() {
    this.currentPosition.selectedIndex = 2;
  }
  editSuppDoc() {
    this.currentPosition.selectedIndex = 3;
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

  // submitClaim = () => {
  //   if (this.reviewForm.valid) {
  //     this.currentPosition.selectedIndex = 5;
  //     this.setTabindex.emit(5);
  //   } else {
  //     this.validationService.validateAllFormFields(this.reviewForm);
  //   }
  // }

  /*
  * @author Deivid Mafra;
  * @date 08/31/2020;
  * @remarks Method responsible for submitting a claim.
  */
  submitClaim = () => {
    this.isSubmit = true;
    this.iscommonerrormsg = false;
    if (this.reviewForm.valid) {
      if (!this.isrecaptcha) {
        this.isCaptcha = true;
        this.onsubmitClaim();
      }

      if (this.isrecaptcha) {
        this.recaptcha3.getToken().then(token => {
          this.getResponceCapcha(token)
          // send data with token to backend
        })
      }
    }

  }

  onsubmitClaim = () => {
    if (this.reviewForm.valid && this.isCaptcha) {
      const lang = sessionStorage.getItem('currentLang');
      const reviewEmail: ReviewEmail = {
        communicationLanguage: lang.includes('en') ? CommunicationLanguage.EN : CommunicationLanguage.FR,
        consentGivenBy: this.reviewForm.get('signature').value,
        // dateOfBirth: this.personalInformation.dateOfBirth,
        // email: this.claimEmail,
        emailWithConsent: this.reviewForm.get('email').value,
        status: Status.SUBMITTED
      };

      const token = sessionStorage.getItem('access_token');
      this.reviewService.updateClaim(this.claimId, reviewEmail, token).subscribe(
        (res: any) => {
          sessionStorage.setItem('submitionDate', res.submitionDate);
          this.currentPosition.selectedIndex = 5;
          this.setTabindex.emit(5);
          this.next.emit();
        },
        error => {
          this.iscommonerrormsg = true;
          document.getElementById('commonerrormsgid').focus();
          // this.toastr.error(error?.error?.error, 'Error');
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.reviewForm);
    }
  }

}
