import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core'; import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { PersonalInfo } from 'src/app/models/personalInfo';
import { HealthCareProviderInfo } from 'src/app/models/healthCareProviderInfo';
import { EmploymentInfo } from 'src/app/models/employmentInfo';
import { PastEmployerInfo } from 'src/app/models/pastEmployerInfo';
import { Documents } from 'src/app/models/documets';
import { Claim } from 'src/app/models/claim';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})


// This class is responsible for Disply user info , Health care info, Employment info and Supporting documents info
export class PrintComponent implements OnInit {

  public claimId: number;
  public referenceNumber: string;
  public personalInformation: PersonalInfo;
  public healthInfo: HealthCareProviderInfo;
  public employInfo: EmploymentInfo;
  public pastEmployInfo: PastEmployerInfo[];
  public claimDocumentsList: Documents[];
  public newclaimDocumentsList: [];
  public audiogramDocumentsList: [];
  @Output() localeChanged: EventEmitter<string> = new EventEmitter();
  public feedbackurl = environment.feedbackurl;

  constructor(private translateService: TranslateService, private httpClient: HttpClient) { }

  ngOnInit() {
    const lang = sessionStorage.getItem('currentLang');
    this.translateService.use(lang);
    this.localeChanged.emit(lang);
    this.getClaim();
  }

  @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHandler(event) {
      localStorage.removeItem('claimPrint');
      localStorage.removeItem('claimDocumentsList');
      localStorage.removeItem('audiogramDocumentsList');
    }

  /*
   * @author Deivid Mafra;
   * @date 08/24/2020;
   * @remarks Method responsible for retrieve data of an existing claim on localStorage.
   * @param claimId
   */
  getClaim = () => {

    const claim: Claim = localStorage.getItem('claimPrint') ? JSON.parse(localStorage.getItem('claimPrint')) : {};
    this.referenceNumber = claim.referenceNumber;
    this.personalInformation = claim.personalInformation;
    this.healthInfo = claim.healthCareProviderInformation;

    this.employInfo = claim.employmentInformation;

    this.pastEmployInfo = this.employInfo ? claim.employmentInformation.pastEmploymentInformationList.sort((a, b) => (a.employmentStartDate > b.employmentStartDate) ? -1 : 1) : null;

    this.newclaimDocumentsList = JSON.parse(localStorage.getItem('claimDocumentsList'));
    this.audiogramDocumentsList = JSON.parse(localStorage.getItem('audiogramDocumentsList'));


    this.claimDocumentsList = claim.claimDocumentsList;

    if (claim?.personalInformation && claim?.personalInformation.primaryTelephoneNumber) {
      const phone1splitted = this.personalInformation.primaryTelephoneNumber.split(' ');
      this.personalInformation.primaryTelephoneNumber = phone1splitted[1];
    }
    if (claim?.personalInformation && claim?.personalInformation.secondaryTelephoneNumber) {
      const phone2splitted = this.personalInformation.secondaryTelephoneNumber.split(' ');
      this.personalInformation.secondaryTelephoneNumber = phone2splitted[1];
    }

    if (claim?.employmentInformation && claim?.employmentInformation.currentEmployerPhoneNumber) {
      const retirementDate = this.employInfo.currentEmployerPhoneNumber.split(' ');
      this.employInfo.currentEmployerPhoneNumber = retirementDate[1];
    }

    /* format dates */
    if (claim.personalInformation && claim.personalInformation.dateOfBirth) {
      this.personalInformation.dateOfBirth = _moment(this.personalInformation.dateOfBirth).format('DD MMM YYYY');
    }
    if (claim.healthCareProviderInformation && claim.healthCareProviderInformation.dateOfFirstAudiogram) {
      this.healthInfo.dateOfFirstAudiogram = _moment(this.healthInfo.dateOfFirstAudiogram).format('DD MMM YYYY');
    }
    if (claim.healthCareProviderInformation && claim.healthCareProviderInformation.entAppointmentDate) {
      this.healthInfo.entAppointmentDate = _moment(this.healthInfo.entAppointmentDate).format('DD MMM YYYY');
    }
    if (claim.healthCareProviderInformation && claim.healthCareProviderInformation.hearingLossNoticedYear) {
      this.healthInfo.hearingLossNoticedYear = _moment(this.healthInfo.hearingLossNoticedYear).format('YYYY');
    }
    if (claim.healthCareProviderInformation && claim.healthCareProviderInformation.hearingAidUsageDate) {
      this.healthInfo.hearingAidUsageDate = _moment(this.healthInfo.hearingAidUsageDate).format('DD MMM YYYY');
    }

  }

}
