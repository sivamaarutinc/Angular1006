import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Province } from 'src/app/models/province';
import { Language } from 'src/app/models/language';
import { PersonalInfo } from 'src/app/models/personalInfo';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { Claim } from 'src/app/models/claim';
import { ValidationService } from 'src/app/services/validation.service';
import { CountryCode } from 'src/app/data/country-code';
import { Languages } from 'src/app/data/languages';
import { TimeoutService } from 'src/app/services/timeout.service';
import * as countrydata from '../../../../assets/i18n/country.json';
import * as languagedata from '../../../../assets/i18n/languagelist.json';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
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
  selector: 'app-my-information',
  templateUrl: './my-information.component.html',
  styleUrls: ['./my-information.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CountryCode,
    Languages
  ]
})


// This class is responsible for submitting form of the user information with validation , storing the user information (name. address, number etc.)
export class MyInformationComponent implements OnInit, OnChanges {

  @ViewChild("search")
  public searchElementRef: ElementRef;
  
  public isLanguageSaved: boolean = false;
  public isOtherLanguage: boolean = false;
  public isCanadaOrUsa: boolean = true;
  public canadaOrUSA: boolean = true;
  public inputValue: string = '';
  public futureDateError: boolean = false;
  public startDate = new Date(1930, 0, 1);
  public countryList: string[];
  public languageList: Language[];
  public today = new Date();
  public minYear = new Date();
  public otherLanguageList: any;
  public provinceListCanada: Array<Province> = countrydata.provinceListCanada;
  public provinceListCanadaFrench: Array<Province> = countrydata.provinceListCanadaFrench;
  public provinceListUSA: Array<Province> = countrydata.provinceListUSA;
  public provinceListUSAFrench: Array<Province> = countrydata.provinceListUSAFrench;
  public countryListEnglish: any = countrydata.countryListEnglish;
  public countryListFrench: any = countrydata.countryListFrench;
  public provinceList: Array<Province> = this.provinceListCanada.slice(0);
  public languageListEnglish: Array<Language> = languagedata.languageListEnglish;
  public languageListFrench: Array<Language> = languagedata.languageListFrench;
  public datevalue: any;
  public validDate: boolean = true;
  public iscommonerrormsg: boolean = false;

  @Input() public claimId: number;
  @Input() public referenceNumber: string;
  @Input() public personalInfo: PersonalInfo;
  @Input() public locale: string;
  @Input() set resultofSaveonExit(value: string) {
    this.saveData(value);
  }

  @Output() formStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() showSuccess: EventEmitter<boolean> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() saveDataonExit1: EventEmitter<any> = new EventEmitter();

  @ViewChild('autocomplete') autocomplete: any;

  myInformationForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÇéâêîôûàèùëïü ]*$')]),
    lastName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÇéâêîôûàèùëïü ]*$')]),
    dob: new FormControl('', [Validators.required, minAge]),
    sin: new FormControl('', mod10Validation),
    streetAddress: new FormControl('', [Validators.required]),
    apartmentSuite: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    provinceState: new FormControl('ON'),
    postalCode: new FormControl('', [Validators.required]),
    country: new FormControl('Canada', Validators.required),
    phone1: new FormControl(undefined, Validators.required),
    phone2: new FormControl(undefined),
    languagePref: new FormControl('EN', Validators.required),
    otherLanguage: new FormControl('')
  });

  constructor(
    private personalInfoService: PersonalInfoService,
    private validationService: ValidationService,
    private countryCodeData: CountryCode,
    private timeout: TimeoutService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
     public googleplaces: DynamicScriptsService,
    private ngZone: NgZone,
  ) {
    this.timeout.init(false);
  }

  ngOnInit() {
    this.loadPersonalInfo();
    this.setMinDate();
    this.checkNullForm();
    this.scrollUpTo(document.getElementsByTagName('div')[0]);
    this.googleplaces.api.then(maps => {
      this.initAutocomplete(maps);
    });
  }

  initAutocomplete(maps: Maps) {
    let autocomplete = new maps.places.Autocomplete(this.searchElementRef.nativeElement);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.addressChange(autocomplete.getPlace());
      });
    });
  }

  // onPlaceChange(place: google.maps.places.PlaceResult) {
  //   console.log(place)
  // }


  ngOnChanges() {
    this.timeout.componentMethodCalled.subscribe((resp) => {
      if (resp === '0') {
        this.addOrUpdatePersonalInfo(false, false, false, false);
      }
    });


    this.checkCountry();
    this.updateCountryList();
    this.updateLanguageList();
    // if (!this.locale || (this.locale && this.locale.includes('en'))) {
    //   if (!this.isLanguageSaved) {
    //     this.myInformationForm.get('languagePref').setValue('EN');
    //     this.myInformationForm.get('otherLanguage').setValue('');
    //   }
    // } else {
    //   if (!this.isLanguageSaved) {
    //     this.myInformationForm.get('languagePref').setValue('FR');
    //     this.myInformationForm.get('otherLanguage').setValue('');
    //   }
    // }

  }


  saveData(name) {
    if (sessionStorage.getItem('component') === '0') {
      if (name === 'exitmyInfo') {

        this.addOrUpdatePersonalInfo(false, false, false, true);

        if (!this.myInformationForm.valid) {
          this.saveDataonExit1.emit();
        }
      }
    }
  }


  setMinDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    this.minYear = date;
  }

  /**
   * @author Deivid Mafra;
   * @date 08/21/2020;
   * @remarks This method is responsible for dynamically positioning the page to the top.
   * @param el It`s representing the html element target.
   */
  scrollUpTo(el: HTMLElement) {
    el.scrollIntoView();
  }

  /**
   * @author Deivid Mafra;
   * @date 08/13/2020;
   * @remarks Method responsible for adding or updating the end-user personal information based on claimId.
   * It retrieves the entire claim object and storage it in the local storage.
   */
  addOrUpdatePersonalInfo = (isSave, alredySaved, isNext, isExit?) => {
    this.iscommonerrormsg = false;
    if (alredySaved) {
      return;
    }
    if (this.myInformationForm.valid) {
      let firstname = this.myInformationForm.get('firstName').value;
      if (firstname) {
        firstname = firstname.trim();
      }
      let lastname = this.myInformationForm.get('lastName').value;
      if (lastname) {
        lastname = lastname.trim();
      }

      let phone1 = this.myInformationForm.get('phone1').value;
      phone1 = phone1 ? '(' + phone1.dialCode + ')' + ' ' + phone1.number : null;

      let phone2 = this.myInformationForm.get('phone2').value;
      phone2 = phone2 ? '(' + phone2.dialCode + ')' + ' ' + phone2.number : null;

      const personalInfo: PersonalInfo = {
        apartment: this.myInformationForm.get('apartmentSuite').value,
        city: this.myInformationForm.get('city').value,
        country: this.myInformationForm.get('country').value,
        dateOfBirth: _moment(this.myInformationForm.get('dob').value).format('YYYY-MM-DD'),
        firstName: firstname,
        languagePreference: this.myInformationForm.get('languagePref').value,
        lastName: lastname,
        otherLanguagePreference: this.myInformationForm.get('otherLanguage').value,
        postalCode: this.myInformationForm.get('postalCode').value,
        primaryTelephoneNumber: phone1,
        provinceOrState: this.parseProvinceStateCode(this.myInformationForm.get('provinceState').value),
        secondaryTelephoneNumber: phone2,
        socialInsuranceNumber: this.myInformationForm.get('sin').value,
        streetAddress: this.myInformationForm.get('streetAddress').value
      };

      const token = sessionStorage.getItem('access_token');
      this.personalInfoService.addOrUpdatePersonalInfo(this.claimId, personalInfo, token).subscribe(
        (res: Claim) => {
          this.isLanguageSaved = true;
          sessionStorage.setItem('claim', JSON.stringify(res));
          let dob = _moment(this.myInformationForm.get('dob').value).format('DD MMM YYYY');
          sessionStorage.setItem('dateOfBirth', dob);
          this.showSuccess.emit(isSave);
          if (!isSave && isNext) {
            this.next.emit();
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
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.myInformationForm);
    }
  }

  parseProvinceStateCode(provinceState) {
    if (this.provinceList.length > 0) {
      for (const provincelist of this.provinceList) {
        if (provincelist.id === provinceState) {
          return provincelist.provinceCode;
        }
      }
    }
    return provinceState;
  }

  loadPersonalInfo = () => {
    this.isLanguageSaved = false;

    if (this.personalInfo) {
      let countryCode = null;
      if (this.personalInfo.country) {
        countryCode = this.countryCodeData.allCountries.find(x => {
          return String(x[0]).toLowerCase().split('(')[0].trim() === this.personalInfo.country.toLowerCase().split('(')[0].trim();
        });
        if (!countryCode) {
          countryCode = this.countryCodeData.allCountries.find(x => {
            return String(x[0]).toLowerCase().split('(')[0].trim().indexOf(this.personalInfo.country.toLowerCase().split('(')[0].trim()) > -1;
          });
        }
      }
      let phone1: any = null;
      if (this.personalInfo.primaryTelephoneNumber) {
        const phone1splitted = this.personalInfo.primaryTelephoneNumber.split(' ');
        phone1 = {
          number: phone1splitted ? phone1splitted[1] : null,
          countryCode: countryCode ? countryCode[1] : null
        };
      }
      let phone2: any = null;
      if (this.personalInfo.secondaryTelephoneNumber) {
        const phone2splitted = this.personalInfo.secondaryTelephoneNumber.split(' ');
        phone2 = {
          number: phone2splitted ? phone2splitted[1] : null,
          countryCode: countryCode ? countryCode[1] : null
        };
      }

      this.myInformationForm.get('apartmentSuite').setValue(this.personalInfo.apartment);
      this.myInformationForm.get('country').setValue(this.personalInfo.country);
      this.myInformationForm.get('dob').setValue(this.personalInfo.dateOfBirth);
      this.myInformationForm.get('firstName').setValue(this.personalInfo.firstName);
      this.myInformationForm.get('lastName').setValue(this.personalInfo.lastName);
      this.myInformationForm.get('otherLanguage').setValue(this.personalInfo.otherLanguagePreference);
      this.myInformationForm.get('postalCode').setValue(this.personalInfo.postalCode);
      this.myInformationForm.get('phone1').setValue(phone1);
      this.myInformationForm.get('provinceState').setValue(this.personalInfo.provinceOrState);
      this.myInformationForm.get('languagePref').setValue(this.personalInfo.languagePreference);
      this.myInformationForm.get('phone2').setValue(phone2);
      this.myInformationForm.get('sin').setValue(this.personalInfo.socialInsuranceNumber);
      this.myInformationForm.get('streetAddress').setValue(this.personalInfo.streetAddress);
      this.myInformationForm.get('city').setValue(this.personalInfo.city);

      this.checkLanguage();
      if (this.personalInfo.languagePreference) {
        this.isLanguageSaved = true;
      }
      this.checkCountry(false);
    } else {
      const dateOfBirth = sessionStorage.getItem('dateOfBirth');
      if (dateOfBirth) {
        this.myInformationForm.get('dob').setValue(new Date(dateOfBirth));
        this.startDate = new Date(dateOfBirth);
      }
    }
  }

  checkNullForm = () => {
    if (
      this.myInformationForm.get('apartmentSuite').value === '' ||
      this.myInformationForm.get('city').value === '' ||
      this.myInformationForm.get('country').value === '' ||
      this.myInformationForm.get('dob').value === '' ||
      this.myInformationForm.get('firstName').value === '' ||
      this.myInformationForm.get('languagePref').value === '' ||
      this.myInformationForm.get('lastName').value === '' ||
      this.myInformationForm.get('otherLanguage').value === '' ||
      this.myInformationForm.get('postalCode').value === '' ||
      this.checkPhone('phone1') ||
      this.myInformationForm.get('provinceState').value === '' ||
      this.checkPhone('phone2') ||
      this.myInformationForm.get('sin').value === '' ||
      this.myInformationForm.get('streetAddress').value === ''
    ) {
      this.formStatus.emit(false);
    } else {
      this.formStatus.emit(true);
    }
  }

  checkPhone(control: string) {
    const val = this.myInformationForm.get(control).value;
    if (val && val.number) {
      return false;
    }
    return true;
  }


  checkSinPattern = event => {
    if (event.keyCode > 47 && event.keyCode < 58) {
      return;
    } else {
      this.myInformationForm.get('sin').setValue(event.target.value.replace(/[^0-9]*/g, ''));
    }
  }

  checkLanguage = () => {
    const language = this.myInformationForm.get('languagePref').value;

    if (language === 'OTHER') {
      this.isOtherLanguage = true;
      this.myInformationForm.get('otherLanguage').setValidators(Validators.required);
    }

    if (language !== 'OTHER') {
      this.isOtherLanguage = false;
      this.myInformationForm.get('otherLanguage').setValue(null);
      this.myInformationForm.get('otherLanguage').setValidators(null);
    }
    this.myInformationForm.get('otherLanguage').updateValueAndValidity();

  }

  Countrychange = () => {
    const country = this.myInformationForm.get('country').value;
    if (country === 'Canada') {
      this.isCanadaOrUsa = true;
      const currentlang = sessionStorage.getItem('currentLang');
      this.provinceList = currentlang === 'fr' ? this.provinceListCanadaFrench.slice(0) : this.provinceListCanada.slice(0);
      this.myInformationForm.get('provinceState').setValue('ON');
    } else if (country === 'USA') {
      this.isCanadaOrUsa = true;
      const currentlang = sessionStorage.getItem('currentLang');
      this.provinceList = currentlang === 'fr' ? this.provinceListUSAFrench : this.provinceListUSA.slice(0);
      this.myInformationForm.get('provinceState').setValue(this.provinceList[0].id);
    }
    else {
      this.isCanadaOrUsa = false;
      this.provinceList = [];
      this.myInformationForm.get('provinceState').setValue('');
    }
    if (this.isCanadaOrUsa) {
      this.myInformationForm.get('provinceState').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
    } else {
      this.myInformationForm.get('provinceState').setValidators(Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`));
    }
    this.myInformationForm.get('provinceState').updateValueAndValidity();
  }


  checkCountry = (loading = true) => {
    const country = this.myInformationForm.get('country').value;
    if (country === 'Canada') {
      this.isCanadaOrUsa = true;
      let newprovinceState;
      const currentlang = sessionStorage.getItem('currentLang');
      this.provinceList = currentlang === 'fr' ? this.provinceListCanadaFrench.slice(0) : this.provinceListCanada.slice(0);
      if (this.myInformationForm.value.provinceState.length !== 2) {
        newprovinceState = this.parseProvinceState(this.myInformationForm.value.provinceState);
      }
      else {
        newprovinceState = this.myInformationForm.value.provinceState;
      }

      // if (loading) {
      const provincestate = this.myInformationForm.value.provinceState ? newprovinceState : this.provinceList[0].id;
      this.myInformationForm.get('provinceState').setValue(provincestate);
      // }
    }
    else if (country === 'USA') {
      this.isCanadaOrUsa = true;
      let newprovinceState;
      const currentlang = sessionStorage.getItem('currentLang');
      this.provinceList = currentlang === 'fr' ? this.provinceListUSAFrench : this.provinceListUSA;
      if (this.myInformationForm.value.provinceState.length !== 2) {
        newprovinceState = this.parseProvinceState(this.myInformationForm.value.provinceState);
      }
      else {
        newprovinceState = this.myInformationForm.value.provinceState;
      }

      // if (loading) {
      const provincestate = this.myInformationForm.value.provinceState ? newprovinceState : this.provinceList[0].id;
      this.myInformationForm.get('provinceState').setValue(provincestate);
      // }
    }
    else {
      this.isCanadaOrUsa = false;
      this.provinceList = [];
      if (loading) {
        const otherprovincestate = this.myInformationForm.value.provinceState;
        this.myInformationForm.get('provinceState').setValue(otherprovincestate ? otherprovincestate : '');
      }
    }
    if (loading) {
      this.myInformationForm.get('phone1').setValue(undefined);
      this.myInformationForm.get('phone2').setValue(undefined);
    }
    /* const city = this.myInformationForm.get('city').value; */
    if (this.isCanadaOrUsa) {
      this.myInformationForm.get('provinceState').setValidators([Validators.required]);
    } else {
      this.myInformationForm.get('provinceState').setValidators(null);
    }
    this.myInformationForm.get('provinceState').updateValueAndValidity();



    if (this.myInformationForm.get('phone1').value) {
      const phone1Data = this.myInformationForm.get('phone1').value;
      const phone1 = {
        number: phone1Data.number,
        countryCode: phone1Data.dialCode
      };
      this.myInformationForm.get('phone1').setValue(phone1);
    }

    if (this.myInformationForm.get('phone2').value) {
      const phone2Data = this.myInformationForm.get('phone2').value;
      const phone2 = {
        number: phone2Data.number,
        countryCode: phone2Data.dialCode
      };
      this.myInformationForm.get('phone2').setValue(phone2);
    }



  }

  addressChange(address: any) {
    // console.log('adas sadasd', address.address_components);
    // this.checkCountry();
    /*this.myInformationForm.get('provinceState').setValue(''); */
    if (this.myInformationForm.get('streetAddress') != null &&
      this.myInformationForm.get('city') != null &&
      this.myInformationForm.get('country') != null) {
      this.resetAddressFields();
    }
    const splitAddress = address.formatted_address.split(',');
    const cleanSplitAddress = splitAddress.map(item => item.trim());
    const splitPostalCode = cleanSplitAddress[2]?.split(' ');
    if (cleanSplitAddress[0].includes('-')) {
      const newSplit = cleanSplitAddress[0].split('-');
      this.myInformationForm.get('apartmentSuite').setValue(newSplit[0]);
      this.myInformationForm.get('streetAddress').setValue(newSplit[1]);
    } else {
      this.myInformationForm.get('streetAddress').setValue(cleanSplitAddress[0]);
    }
    this.myInformationForm.get('city').setValue(cleanSplitAddress[1]);

    if (cleanSplitAddress[3] === 'Canada' || cleanSplitAddress[3] === 'USA') {
      this.isCanadaOrUsa = true;
      this.inputValue = '+1';
      this.myInformationForm.get('country').setValue(cleanSplitAddress[3]);
      this.checkCountry();
      this.myInformationForm.get('provinceState').setValue(splitPostalCode[0]);
      splitPostalCode[2] != null ? this.myInformationForm.get('postalCode').setValue(splitPostalCode[1] + ' ' + splitPostalCode[2]) :
        this.myInformationForm.get('postalCode').setValue(splitPostalCode[1]);

    } else {
      this.isCanadaOrUsa = false;
      const countryReturned = cleanSplitAddress.pop();
      this.myInformationForm.get('country').setValue(countryReturned);
      this.checkCountry();
    }
  }

  parseProvinceState(provinceState) {

    if (this.provinceList.length > 0) {
      for (const provincelist of this.provinceList) {
        if (provincelist.provinceCode === provinceState) {
          return provincelist.id;
        }
      }
    }
    return provinceState;
  }
  // parseProvinceState(provinceState) {
  //   if (this.provinceList.length > 0) {
  //     for (const provincelist of this.provinceList) {
  //       if (provincelist.id === provinceState) {
  //         return provincelist.provinceName;
  //       }
  //     }
  //   }
  //   return provinceState;
  // }


  toFormattedDate(iso: string) {

    const date = new Date(iso);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }




  checkDate(value) {

    this.datevalue = value.length;

    if (value.length === 3) {
      const character3 = value.charAt(2);
      const isnum3 = /^\d+$/.test(character3);
      if (isnum3) {
        this.myInformationForm.get('dob').setValue('');
      }
    }

    this.validDate = this.IsValidDate(value);


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

  resetAddressFields() {
    this.myInformationForm.get('streetAddress').setValue('');
    this.myInformationForm.get('postalCode').setValue('');
    this.myInformationForm.get('provinceState').setValue('');
    this.myInformationForm.get('city').setValue('');
    this.myInformationForm.get('country').setValue('');
    this.myInformationForm.get('apartmentSuite').setValue('');
  }

  isFieldValid(form: FormGroup, field: string, splchk = null, dateFormatCheck = null) {

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



  isFieldTouched(form: FormGroup, field: string, splchk = null, dateFormatCheck = null) {
    if (form.get(field).touched) {
      return this.isFieldValid(form, field, splchk, dateFormatCheck);
    }
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field)
    };
  }

  replaceSpaces(formControl: string) {
    let value = this.myInformationForm.get(formControl).value;
    value = value.replace(/\s\s+/g, ' ');
    if (value) {
      this.myInformationForm.get(formControl).setValue(value);
    }
  }

  trimpaces(formControl: string) {
    const value = this.myInformationForm.get(formControl).value;
    if (value) {
      this.myInformationForm.get(formControl).setValue(value.trim());
    }
  }

  updateCountryList() {
    if (sessionStorage.getItem('currentLang') === 'fr') {
      this.countryList = this.countryListFrench;
    } else {
      this.countryList = this.countryListEnglish;
    }
  }

  // checkdobPattern(event) {
  //   var re = /^([0]?[1-9]|[1-2]\\d|3[0-1]) ([Jj][Aa][Nn][Ff][Ee][Bb][Mm][Aa][Rr][Aa][Pp][Rr][Mm][Aa][Yy][Jj][Uu][Nn][Jj][Uu][Ll][Aa][Uu][Gg][Ss][Ee][Pp][Nn][Oo][Vv][Dd][Ee][Cc][Jj][Aa][Nn][Ff][Éé][Vv][Aa][Vv][Rr][Mm][Aa][Ii][Aa][Oo][Ûû][Dd][Éé][Cc]) 1-2]\\d{3}$/;
  //   console.log(re.test(event.target.value))
  //   return re.test(event.target.value);
  // }

  validateFutureDate(event) {
    this.futureDateError = false;
    const year = (event.target.value).split(' ').pop();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    if (year > currentYear) {
      this.futureDateError = true;
    }

    this.datevalue = event.target.value.length;
    this.validDate = this.IsValidDate(event.target.value);
    // var re = /^([0]?[1-9]|[1-2]\\d|3[0-1]) ([Jj][Aa][Nn][Ff][Ee][Bb][Mm][Aa][Rr][Aa][Pp][Rr][Mm][Aa][Yy][Jj][Uu][Nn][Jj][Uu][Ll][Aa][Uu][Gg][Ss][Ee][Pp][Nn][Oo][Vv][Dd][Ee][Cc][Jj][Aa][Nn][Ff][Éé][Vv][Aa][Vv][Rr][Mm][Aa][Ii][Aa][Oo][Ûû][Dd][Éé][Cc]) 1-2]\\d{3}$/;
    // console.log(re.test(event.target.value))
    // return re.test(event.target.value);
  }

  updateLanguageList() {
    if (sessionStorage.getItem('currentLang') === 'fr') {
      this.otherLanguageList = this.languageListFrench.slice(3);
      this.languageList = this.languageListFrench.slice(0, 3);
    } else {
      this.otherLanguageList = this.languageListEnglish.slice(3);
      this.languageList = this.languageListEnglish.slice(0, 3);
    }
  }


}


function minAge(control: FormControl) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 16);
  const minYear = date;

  if (control) {
    if (control.value > minYear) {
      return {
        invalid: true
      };
    }
  }
}

function mod10Validation(control: FormControl) {
  const num = control.value;
  if (num) {
    if (num.length < 9) {
      return {
        invalid: true
      };
    }
    let check;
    let even;
    let tot;
    let sin = num;
    if (typeof sin === 'number') {
      sin = sin.toString();
    }
    if (sin.length === 9) {
      // convert to an array & pop off the check digit
      sin = sin.split('');
      check = +sin.pop();
      even = sin.filter(
        (_, i) => i % 2
      ).map(
        (n) => n * 2
      ).join('').split('');
      tot = sin.filter(
        (_, i) => !(i % 2)
      ).concat(even).map(
        (n) => +n
      ).reduce(
        (acc, cur) => acc + cur
      );
      if (check === (10 - (tot % 10)) % 10) { } else {
        return {
          invalid: true
        };
      }
    } else {
      return {
        invalid: true
      };
    }
  }
  return null;
}



