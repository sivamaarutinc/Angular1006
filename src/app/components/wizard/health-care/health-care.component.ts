import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HealthCareProviderInfo } from 'src/app/models/healthCareProviderInfo';
import { PersonalInfo } from 'src/app/models/personalInfo';
import { HealthCareProviderInfoService } from 'src/app/services/health-care-provider-info.service';
import { Claim } from 'src/app/models/claim';
import { ValidationService } from 'src/app/services/validation.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { TimeoutService } from 'src/app/services/timeout.service';
import { TranslateService } from '@ngx-translate/core';
import { DynamicScriptsService, Maps } from 'src/app/services/dynamic-scripts.service';

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
  selector: 'app-health-care',
  templateUrl: './health-care.component.html',
  styleUrls: ['./health-care.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

/* This class is responsible for Gathering user's health imformation (audiogram)  */
export class HealthCareComponent implements OnInit, OnChanges {
  public isFutureDate: boolean = false;
  public maxDate = new Date();
  public invalidFutureYear: boolean = false;
  public invalidPastYear: boolean = false;
  public validhearingAidUsageDate: boolean = true;
  public validdateOfFirstAudiogram: boolean = true;
  public validentAppointmentDate: boolean = true;
  public datevalue1: any;
  public datevalue2: any;
  public datevalue3: any;
  public iscommonerrormsg: boolean = false;
  @Input() public claimId: number;
  @Input() public referenceNumber: string;
  @Input() public healthCareProviderInfo: HealthCareProviderInfo;
  @Input() public personalInformation: PersonalInfo;
  @Input() set resultofSaveonExit(value: string) {
    this.saveData(value);
  }
  @Output() formStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() showSuccess: EventEmitter<boolean> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() previous: EventEmitter<void> = new EventEmitter();
  @Output() saveDataonExit1: EventEmitter<any> = new EventEmitter();
  @ViewChild("name") nameField: ElementRef;


  @ViewChild("audiogramClinicAddress")
  public audiogramClinicAddressElementRef: ElementRef;

  @ViewChild("entSpecialistAddress")
  public entSpecialistAddressElementRef: ElementRef;

  continueHealthCareForm = new FormGroup({
    hearingLossNoticedYear: new FormControl('', [Validators.required, futureDateValidation, pastDateValidation]),
    dateOfFirstAudiogram: new FormControl('', Validators.required),
    audiogramClinicName: new FormControl(null, [Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]),
    audiogramClinicAddress: new FormControl(null, [Validators.required]),
    audiogramClinicPhoneNumber: new FormControl(null, Validators.required),
    hasVisitedEntSpecialist: new FormControl(null, Validators.required),
    entAppointmentDate: new FormControl(''),
    entSpecialistName: new FormControl(null),
    entSpecialistPhoneNumber: new FormControl(null),
    entSpecialistAddress: new FormControl(null),
    hasRingingInEar: new FormControl(null, Validators.required),
    ringingEarDuration: new FormControl(null),
    hasSevereRingingInEar: new FormControl(null),
    hasConstantRingingInEar: new FormControl(null),
    hasHearingAid: new FormControl(null, Validators.required),
    hearingAidUsageDate: new FormControl(null),
  });

  constructor(
    private healthCareProviderInfoService: HealthCareProviderInfoService,
    private validationService: ValidationService,
    private timeout: TimeoutService,
    private translate: TranslateService,
    public googleplaces: DynamicScriptsService,
    private ngZone: NgZone,
  ) {

  }

  ngOnInit() {

    this.loadHealthCareInfo();
    this.checkNullForm();
    this.entValidation();
    this.ringValidation();
    this.aidValidation();
    this.googleplaces.api.then(maps => {
      this.initAutocomplete(maps, this.audiogramClinicAddressElementRef.nativeElement, 0);

    });

  }

  initAutocomplete(maps: Maps, element, indx) {
    let autocomplete = new maps.places.Autocomplete(element);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.addressChange(autocomplete.getPlace(), indx);
      });
    });
  }

  ngOnChanges() {
    if (this.nameField) {
      this.nameField.nativeElement.focus();
    }

    this.timeout.componentMethodCalled.subscribe((resp) => {
      if (resp === '1') {
        this.addOrUpdateHealthCareProviderInfo(false, false, false, false);
      }
    });
  }

  saveData(name) {
    if (sessionStorage.getItem('component') === '1') {
      if (name === 'exithealthcare') {

        this.addOrUpdateHealthCareProviderInfo(false, false, false, true);

        if (!this.continueHealthCareForm.valid) {
          this.saveDataonExit1.emit();
        }
      }
    }
  }

  aidValidation = () => {
    this.continueHealthCareForm.get('hasHearingAid').valueChanges.subscribe(checked => {
      if (checked === true) {
        this.continueHealthCareForm.get('hearingAidUsageDate').setValidators(Validators.required);
      } else {
        this.continueHealthCareForm.get('hearingAidUsageDate').setValidators(null);
        this.continueHealthCareForm.setErrors(null);
      }
      this.continueHealthCareForm.updateValueAndValidity();
    });
  }

  ringValidation = () => {
    this.continueHealthCareForm.get('hasRingingInEar').valueChanges.subscribe(checked => {
      if (checked === true) {
        this.continueHealthCareForm.get('ringingEarDuration').setValidators(Validators.required);
        this.continueHealthCareForm.get('hasSevereRingingInEar').setValidators(Validators.required);
        this.continueHealthCareForm.get('hasConstantRingingInEar').setValidators(Validators.required);
      } else {
        this.continueHealthCareForm.get('ringingEarDuration').setValidators(null);
        this.continueHealthCareForm.get('hasSevereRingingInEar').setValidators(null);
        this.continueHealthCareForm.get('hasConstantRingingInEar').setValidators(null);
        this.continueHealthCareForm.setErrors(null);

      }
      this.continueHealthCareForm.updateValueAndValidity();
    });
  }

  entValidation = () => {
    this.continueHealthCareForm.get('hasVisitedEntSpecialist').valueChanges.subscribe(checked => {
      if (checked === true) {

        this.continueHealthCareForm.get('entAppointmentDate').setValidators(Validators.required);
        this.continueHealthCareForm.get('entSpecialistName').setValidators([Validators.required, Validators.pattern('^[A-Za-zÇéâêîôûàèùëïü ]*$')]);
        this.continueHealthCareForm.get('entSpecialistPhoneNumber').setValidators(Validators.required);
        // this.continueHealthCareForm.get('entSpecialistAddress').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
        this.continueHealthCareForm.get('entSpecialistAddress').setValidators([Validators.required]);
        setTimeout(() => {
          this.googleplaces.api.then(maps => {
            this.initAutocomplete(maps, this.entSpecialistAddressElementRef.nativeElement, 1);
          });
        }, 200);

      } else {
        this.continueHealthCareForm.get('entAppointmentDate').setValidators(null);
        this.continueHealthCareForm.get('entSpecialistName').setValidators(null);
        this.continueHealthCareForm.get('entSpecialistPhoneNumber').setValidators(null);
        this.continueHealthCareForm.get('entSpecialistAddress').setValidators(null);
        this.continueHealthCareForm.setErrors(null);

      }
      this.continueHealthCareForm.updateValueAndValidity();
    });
  }

  checkNullForm = () => {
    if (
      this.continueHealthCareForm.get('hearingLossNoticedYear').value === null ||
      this.continueHealthCareForm.get('hearingLossNoticedYear').value === '' ||
      this.continueHealthCareForm.get('dateOfFirstAudiogram').value === null ||
      this.continueHealthCareForm.get('dateOfFirstAudiogram').value === '' ||
      this.continueHealthCareForm.get('audiogramClinicName').value === null ||
      this.continueHealthCareForm.get('audiogramClinicName').value === '' ||
      this.continueHealthCareForm.get('audiogramClinicAddress').value === null ||
      this.continueHealthCareForm.get('audiogramClinicAddress').value === '' ||
      this.continueHealthCareForm.get('audiogramClinicPhoneNumber').value === null ||
      this.continueHealthCareForm.get('audiogramClinicPhoneNumber').value === '' ||
      this.continueHealthCareForm.get('hasVisitedEntSpecialist').value === null ||
      this.continueHealthCareForm.get('hasRingingInEar').value === null ||
      this.continueHealthCareForm.get('hasHearingAid').value === null
    ) {
      // console.log('one field is empty on basic questions');
      this.formStatus.emit(false);
      return;
    }

    if (this.continueHealthCareForm.get('hasVisitedEntSpecialist').value === true) {
      if (
        this.continueHealthCareForm.get('entAppointmentDate').value === '' ||
        this.continueHealthCareForm.get('entSpecialistName').value === '' ||
        this.continueHealthCareForm.get('entSpecialistAddress').value === '' ||
        this.continueHealthCareForm.get('entSpecialistPhoneNumber').value === ''
      ) {
        // console.log('one field is empty on hasVisitedEntSpecialist = true');
        this.formStatus.emit(false);
        return;
      }
    }

    if (this.continueHealthCareForm.get('hasRingingInEar').value === true) {
      if (
        this.continueHealthCareForm.get('ringingEarDuration').value === null ||
        this.continueHealthCareForm.get('hasSevereRingingInEar').value === null ||
        this.continueHealthCareForm.get('hasConstantRingingInEar').value === null
      ) {
        // console.log('one field is empty on hasRingingInEar = true');
        this.formStatus.emit(false);
        return;
      }
    }

    if (this.continueHealthCareForm.get('hasHearingAid').value === true) {

      if (this.continueHealthCareForm.get('hearingAidUsageDate').value === '') {
        // console.log('hearingAidUsageDate field is empty');
        this.formStatus.emit(false);
        return;
      }
    }

    this.formStatus.emit(true);
    // console.log('all fields okay in continueHealthCareForm');

  }

  addressChange(address: any, value) {
    if (value === 0) {
      this.continueHealthCareForm.get('audiogramClinicAddress').setValue(this.parseAddress(address.formatted_address));
    } else if (value === 1) {
      this.continueHealthCareForm.get('entSpecialistAddress').setValue(this.parseAddress(address.formatted_address));
    }
  }

  parseAddress(address) {
    return address.replace(', ', '\n');
  }

  /*
  * @author Gowtham;
  * @date 08/15/2020;
  * @remarks Method responsible for adding or updating the health care provider info based on claimId.
  * It retrieves the entire claim object and storage it in the local storage.
  */
  addOrUpdateHealthCareProviderInfo = (isSave, alreadySaved, isNext = false, isExit?) => {
    // this.yearErrormessage = "";
    this.iscommonerrormsg = false;
    if (alreadySaved) {
      return;
    }

    if (this.continueHealthCareForm.valid) {

      const healthCareProviderInfo: HealthCareProviderInfo = {
        audiogramClinicAddress: this.continueHealthCareForm.get('audiogramClinicAddress').value,
        audiogramClinicName: this.continueHealthCareForm.get('audiogramClinicName').value,
        audiogramClinicPhoneNumber: this.continueHealthCareForm.get('audiogramClinicPhoneNumber').value,
        dateOfFirstAudiogram: this.continueHealthCareForm.get('dateOfFirstAudiogram').value ? _moment(this.continueHealthCareForm.get('dateOfFirstAudiogram').value).format('YYYY-MM-DD') : '',
        entAppointmentDate: this.continueHealthCareForm.get('entAppointmentDate').value ? _moment(this.continueHealthCareForm.get('entAppointmentDate').value).format('YYYY-MM-DD') : '',
        entSpecialistAddress: this.continueHealthCareForm.get('entSpecialistAddress').value,
        entSpecialistName: this.continueHealthCareForm.get('entSpecialistName').value,
        entSpecialistPhoneNumber: this.continueHealthCareForm.get('entSpecialistPhoneNumber').value,
        hasHearingAid: this.continueHealthCareForm.get('hasHearingAid').value,
        hasRingingInEar: this.continueHealthCareForm.get('hasRingingInEar').value,
        hasSevereRingingInEar: this.continueHealthCareForm.get('hasSevereRingingInEar').value,
        hasConstantRingingInEar: this.continueHealthCareForm.get('hasConstantRingingInEar').value,
        hasVisitedEntSpecialist: this.continueHealthCareForm.get('hasVisitedEntSpecialist').value,
        hearingAidUsageDate: this.continueHealthCareForm.get('hearingAidUsageDate').value ? _moment(this.continueHealthCareForm.get('hearingAidUsageDate').value).format('YYYY-MM-DD') : '',
        hearingLossNoticedYear: this.continueHealthCareForm.get('hearingLossNoticedYear').value ? this.continueHealthCareForm.get('hearingLossNoticedYear').value : '',
        ringingEarDuration: this.continueHealthCareForm.get('ringingEarDuration').value,
      };

      const token = sessionStorage.getItem('access_token');
      this.healthCareProviderInfoService.addOrUpdateHealthCareProviderInfo(this.claimId, healthCareProviderInfo, token).subscribe(
        (res: Claim) => {
          sessionStorage.setItem('claim', JSON.stringify(res));
          this.showSuccess.emit(isSave);
          if (!isSave && isNext) {
            isNext ? this.next.emit() : this.previous.emit();
          }


          if (isExit) {
            sessionStorage.clear();

            const lang = sessionStorage.getItem('currentLang');
            const isEnglish = lang === 'en' ? true : false;
            const isFrench = lang === 'fr' ? true : false;

            let exitLink: any;

            if (isFrench) {
              exitLink = 'https://www.wsib.ca/fr/servicesenligne';
            } else {
              exitLink = 'https://wsib.ca/en/onlineservices';
            }
            setTimeout(() => {
              window.location.href = exitLink;
            }, 500);
            return;
          }


        },
        error => {
          this.iscommonerrormsg = true;
          document.getElementById('commonerrormsgid').focus();

          // this.toastr.error(error?.error?.error, 'Error');
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.continueHealthCareForm);
    }
  }

  loadHealthCareInfo = () => {
    if (this.healthCareProviderInfo) {
      this.continueHealthCareForm.get('audiogramClinicAddress').setValue(this.healthCareProviderInfo.audiogramClinicAddress);
      this.continueHealthCareForm.get('audiogramClinicName').setValue(this.healthCareProviderInfo.audiogramClinicName);
      this.continueHealthCareForm.get('audiogramClinicPhoneNumber').setValue(this.healthCareProviderInfo.audiogramClinicPhoneNumber);
      this.continueHealthCareForm.get('dateOfFirstAudiogram').setValue(this.healthCareProviderInfo.dateOfFirstAudiogram);
      this.continueHealthCareForm.get('entAppointmentDate').setValue(this.healthCareProviderInfo.entAppointmentDate);
      this.continueHealthCareForm.get('entSpecialistAddress').setValue(this.healthCareProviderInfo.entSpecialistAddress);
      this.continueHealthCareForm.get('entSpecialistName').setValue(this.healthCareProviderInfo.entSpecialistName);
      this.continueHealthCareForm.get('entSpecialistPhoneNumber').setValue(this.healthCareProviderInfo.entSpecialistPhoneNumber);
      this.continueHealthCareForm.get('hasHearingAid').setValue(this.healthCareProviderInfo.hasHearingAid);
      this.continueHealthCareForm.get('hasRingingInEar').setValue(this.healthCareProviderInfo.hasRingingInEar);
      this.continueHealthCareForm.get('hasSevereRingingInEar').setValue(this.healthCareProviderInfo.hasSevereRingingInEar);
      this.continueHealthCareForm.get('hasConstantRingingInEar').setValue(this.healthCareProviderInfo.hasConstantRingingInEar);
      this.continueHealthCareForm.get('hasVisitedEntSpecialist').setValue(this.healthCareProviderInfo.hasVisitedEntSpecialist);
      this.continueHealthCareForm.get('hearingAidUsageDate').setValue(this.healthCareProviderInfo.hearingAidUsageDate);
      this.continueHealthCareForm.get('ringingEarDuration').setValue(this.healthCareProviderInfo.ringingEarDuration);
      this.continueHealthCareForm.get('hearingLossNoticedYear').setValue(this.healthCareProviderInfo.hearingLossNoticedYear);
      if (this.healthCareProviderInfo.hasVisitedEntSpecialist) {
        this.googleplaces.api.then(maps => {
          this.initAutocomplete(maps, this.entSpecialistAddressElementRef.nativeElement, 1);
        });
      }
    }
  }


  hasHearingAidChange = () => {
    this.continueHealthCareForm.get('hearingAidUsageDate').setValue('');
  }

  hasVisitedEntSpecialistChange = () => {

    this.continueHealthCareForm.get('entAppointmentDate').setValue('');
    this.continueHealthCareForm.get('entSpecialistName').setValue(null);
    this.continueHealthCareForm.get('entSpecialistAddress').setValue(null);
    this.continueHealthCareForm.get('entSpecialistPhoneNumber').setValue(null);
  }

  hasRingingInEarChange = () => {
    this.continueHealthCareForm.get('ringingEarDuration').setValue(null);
    this.continueHealthCareForm.get('hasSevereRingingInEar').setValue(null);
    this.continueHealthCareForm.get('hasConstantRingingInEar').setValue(null);

  }

  private formatDate = (date?: Date | string) => {
    date = new Date(date);
    if (date) {
      return `${date.getFullYear()}-${this.addprfix(date.getMonth() + 1)}-${this.addprfix(date.getDate())}`;
    }
    return null;
  }

  private addprfix = (val: number) => {
    if (val < 10) {
      return `0${val}`;
    }
    return `${val}`;
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

  validateYear(event: any) {
    const dateOfBirth = sessionStorage.getItem('dateOfBirth');
    if (dateOfBirth) {
      const getYear = new Date(dateOfBirth).getFullYear();
      const getCurrentYear = new Date().getFullYear();
      // const getpastYear = getCurrentDate.getFullYear();

      if (+getCurrentYear < Number(event.target.value)) {

        this.continueHealthCareForm.get('hearingLossNoticedYear').setErrors({ incorrect: true });

        this.invalidFutureYear = true;
        this.invalidPastYear = false;
      }
      else if (+getYear > Number(event.target.value)) {
        this.invalidFutureYear = false;
        this.invalidPastYear = true;
      }
      else {
        this.continueHealthCareForm.get('hearingLossNoticedYear').setValue(event.target.value.replace(/[^0-9]*/g, ''));

        this.invalidFutureYear = false;
        this.invalidPastYear = false;


      }

    }
    if (event.keyCode > 47 && event.keyCode < 58) {
      return;
    }
  }

  replaceSpaces(formControl: string) {
    let value = this.continueHealthCareForm.get(formControl).value;
    value = value.replace(/\s\s+/g, ' ');
    if (value) {
      this.continueHealthCareForm.get(formControl).setValue(value);
    }
  }

  trimpaces(formControl: string) {
    const value = this.continueHealthCareForm.get(formControl).value;
    if (value) {
      this.continueHealthCareForm.get(formControl).setValue(value.trim());
    }
  }

  // validateFutureDates(event) {
  //   let currentDate = new Date();
  //   if (event.target.value > currentDate.getFullYear()) {
  //     this.isFutureDate = true;
  //   } else {
  //     this.isFutureDate = false;
  //   }
  // }

  checkPhone(event, field) {
    if (event.keyCode > 47 && event.keyCode < 58) {
      return;
    } else if (field === 'adClinic') {
      this.continueHealthCareForm.get('audiogramClinicPhoneNumber').setValue(event.target.value.replace(/[^0-9-+() ]*/g, ''));
    } else if (field === 'entSpecialist') {
      this.continueHealthCareForm.get('entSpecialistPhoneNumber').setValue(event.target.value.replace(/[^0-9-+() ]*/g, ''));
    }
  }

  focusOutonDate(value, item?) {
    if (item === 'hearingAidUsageDate') {
      this.datevalue1 = value.length;
      this.validhearingAidUsageDate = this.IsValidDate(value);
    }
    if (item === 'dateOfFirstAudiogram') {
      this.datevalue2 = value.length;
      this.validdateOfFirstAudiogram = this.IsValidDate(value);
    }
    if (item === 'entAppointmentDate') {
      this.datevalue3 = value.length;
      this.validentAppointmentDate = this.IsValidDate(value);
    }
  }

  checkDate(value, item?) {
    if (item === 'hearingAidUsageDate') {
      this.datevalue1 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.continueHealthCareForm.get('hearingAidUsageDate').setValue('');
        }
      }

      this.validhearingAidUsageDate = this.IsValidDate(value);
    }
    if (item === 'dateOfFirstAudiogram') {
      this.datevalue2 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.continueHealthCareForm.get('dateOfFirstAudiogram').setValue('');
        }
      }

      this.validdateOfFirstAudiogram = this.IsValidDate(value);
    }
    if (item === 'entAppointmentDate') {
      this.datevalue3 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.continueHealthCareForm.get('entAppointmentDate').setValue('');
        }
      }

      this.validentAppointmentDate = this.IsValidDate(value);
    }
  }

  IsValidDate(value) {
    const d = value;

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
    if (month === 'JAN' || month === 'MAR' || month === 'MAY' || month === 'MAI' || month === 'JUL' || month === 'AUG' || month === 'AOÛ' || month === 'OCT' || month === 'DEC' || month === 'DÉC') {
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
        if (month === 'FEB' || month === 'FÉV') {
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

function futureDateValidation(control: FormControl) {
  const num = control.value;
  const currentDate = new Date();
  if (num) {
    if (num > currentDate.getFullYear()) {
      return { invalid: true };
    } else {
      return null;
    }
  }
  return null;
}

function pastDateValidation(control: FormControl) {
  const num = control.value;
  const dateOfBirth = sessionStorage.getItem('dateOfBirth');
  if (dateOfBirth) {
    const getYear = new Date(dateOfBirth).getFullYear();
    if (num) {
      if (num < getYear) {
        return { invalid: true };
      } else {
        return null;
      }
    }
  }
  return null;
}

