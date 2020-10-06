import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, SimpleChanges, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PastEmploymentInfoService } from 'src/app/services/past-employment-info.service';
import { Tools } from 'src/app/models/tools';
import { PastEmployerInfoDTO } from 'src/app/DTOs/PastEmployerInfoDTO';
import { PastEmployerInfo } from 'src/app/models/pastEmployerInfo';
import { ValidationService } from 'src/app/services/validation.service';
import { Province } from 'src/app/models/province';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CountryCode } from 'src/app/data/country-code';
import * as _moment from 'moment';
import * as data from 'src/assets/i18n/country.json';
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
  selector: 'app-add-employer-modal',
  templateUrl: './add-employer-modal.component.html',
  styleUrls: ['./add-employer-modal.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CountryCode,
  ]
})


// This class is responsible for Gathering info about past employement (i.e name , address, occupation etc.)
export class AddEmployerModalComponent implements OnInit, AfterViewInit, OnChanges,OnDestroy {
  @ViewChild('cancelBtn') cancelBtn: any;
  public employedToMinimumDate: Date;
  public maxDate = new Date();
  public lowerthanZero: boolean = false;
  public greterthantwentyfor: boolean = false;
  public istoolform: boolean = true;
  public isNumber: boolean = false;
  public isTool: boolean = false;
  public isCanadaOrUsa: boolean = true;
  public invalidHours: boolean = false;
  public tools: Array<Tools> = new Array<Tools>();
  public toolSearchString: string;
  public test: string[];
  public keyword = 'toolEnName';
  public toolList: string[];
  public currentLang: string;
  public toolListOverLimit: boolean;
  public fromdate: Date;
  public todate: Date;
  public isfromdate: boolean = false;
  public issubmitForm: boolean = false;
  public issubmit: boolean = false;
  public toolInput = new FormControl();
  public filteredOptions: Observable<string[]>;
  public isCanada: boolean = true;
  public dateCheck: boolean = true;
  checkDot: boolean = false;
  public countryList: string[];
  public provinceListCanada: Array<Province> = data.provinceListCanada;
  public provinceListCanadaFrench: Array<Province> = data.provinceListCanadaFrench;
  public provinceListUSA: Array<Province> = data.provinceListUSA;
  public provinceListUSAFrench: Array<Province> = data.provinceListUSAFrench;
  public countryListEnglish: any = data.countryListEnglish;
  public countryListFrench: any = data.countryListFrench;
  public provinceList: Array<Province> = this.provinceListCanada.slice(0);
  public futureDateErrorFrom: boolean = false;
  public futureDateErrorTo: boolean = false;
  public validemployedFrom: boolean = true;
  public validemployedTo: boolean = true;
  public datevalue1: any;
  public datevalue2: any;

  @Input() public claimId: number;
  @Input() public pastEmployerInfo: PastEmployerInfo;
  @Input() public predefinedToolList: Array<string> = new Array<string>();
  @Output() addOrUpdatePastEmployment = new EventEmitter<PastEmployerInfoDTO>();

  employerForm = new FormGroup({
    employerName: new FormControl('', [Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]),
    stillInBusiness: new FormControl('', Validators.required),
    employerAddress: new FormControl(''),
    jobTitle: new FormControl('', [Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]),
    employedFrom: new FormControl('', Validators.required),
    employedTo: new FormControl({ value: '', disabled: true }, Validators.required),

    country: new FormControl('Canada', Validators.required),
    provinceState: new FormControl('ON', Validators.required),
    employerPhoneNumber: new FormControl(''),
  });

  @ViewChild("employerAddress")
  public employerAddress: ElementRef;

  toolsForm = new FormGroup({
    toolName: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
    // hoursUsed: new FormControl(null, [Validators.required, Validators.pattern('^(\d*\.)?\d+$')]),
    hoursUsed: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]),
  });

  constructor(
    private pastEmploymentService: PastEmploymentInfoService,
    private validationService: ValidationService,
    private countryCodeData: CountryCode,
    public googleplaces: DynamicScriptsService,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {

    const lang = sessionStorage.getItem('currentLang');

    if (lang) {
      if (lang.includes('en')) {
        this.currentLang = 'toolEnName';
      } else {
        this.currentLang = 'toolFrName';
      }
    }

    this.googleplaces.api.then(maps => {
      this.initAutocomplete(maps, this.employerAddress.nativeElement);

    });


    // this.getAllTools();

  }
  initAutocomplete(maps: Maps, element) {
    let autocomplete = new maps.places.Autocomplete(element);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.addressChange(autocomplete.getPlace());
      });
    });
  }

  ngAfterViewInit() {
    this.employerForm.markAsUntouched();
  }
  ngOnDestroy() {
    this.cancelBtn.nativeElement.click();
  }
  replaceSpaces(formControl: string) {
    let value = this.employerForm.get(formControl).value;
    value = value.replace(/\s\s+/g, ' ');
    if (value) {
      this.employerForm.get(formControl).setValue(value);
    }
  }

  trimpaces(formControl: string) {
    const value = this.employerForm.get(formControl).value;
    if (value) {
      this.employerForm.get(formControl).setValue(value.trim());
    }
  }


  updateCountryList() {
    if (sessionStorage.getItem('currentLang') === 'fr') {
      this.countryList = this.countryListFrench;
    } else {
      this.countryList = this.countryListEnglish;
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

  checkCountry = () => {
    const country = this.employerForm.get('country').value;
    if (country === 'Canada') {

      this.isCanadaOrUsa = true;
      let newprovinceState;
      const currentlang = sessionStorage.getItem('currentLang');
      this.provinceList = currentlang === 'fr' ? this.provinceListCanadaFrench.slice(0) : this.provinceListCanada.slice(0);
      if (this.employerForm.value.provinceState && this.employerForm.value.provinceState.length !== 2) {
        newprovinceState = this.parseProvinceState(this.employerForm.value.provinceState);

      }
      else {
        newprovinceState = this.employerForm.value.provinceState;
      }
      // if (loading) {
      const provincestate = newprovinceState ? newprovinceState : this.provinceList[0].id;
      this.employerForm.get('provinceState').setValue(provincestate);
      // }
    }
    else if (country === 'USA') {
      this.isCanadaOrUsa = true;
      let newprovinceState;
      const currentlang = sessionStorage.getItem('currentLang');
      this.provinceList = currentlang === 'fr' ? this.provinceListUSAFrench : this.provinceListUSA;


      if (this.employerForm.value.provinceState && this.employerForm.value.provinceState.length !== 2) {
        newprovinceState = this.parseProvinceState(this.employerForm.value.provinceState);
      }
      else {
        newprovinceState = this.employerForm.value.provinceState;
      }

      // if (loading) {
      const provincestate = this.employerForm.value.provinceState ? newprovinceState : this.provinceList[0].id;
      this.employerForm.get('provinceState').setValue(provincestate);
      // }
    }
    else {
      this.isCanadaOrUsa = false;
      this.provinceList = [];
      const otherprovincestate = this.employerForm.value.provinceState;
      if (!this.employerForm.get('provinceState').value) {
        this.employerForm.get('provinceState').setValue('');
      }

    }
    this.employerForm.get('employerPhoneNumber').setValue(undefined);
    /* const city = this.myInformationForm.get('city').value; */
    if (this.isCanadaOrUsa) {
      // this.myInformationForm.get('provinceState').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
      this.employerForm.get('provinceState').setValidators([Validators.required]);
    } else {
      // this.myInformationForm.get('provinceState').setValidators(Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`));
      this.employerForm.get('provinceState').setValidators(null);
    }
    this.employerForm.get('provinceState').updateValueAndValidity();


    if (country === 'USA' || country === 'Canada') {
      this.isCanadaOrUsa = true;
    } else {
      this.isCanadaOrUsa = false;
    }


  }


  ngOnChanges(changes: SimpleChanges) {

    const changeKey = Object.keys(changes);

    if (!this.employerForm.get('country').value) {
      const employerPhone = {
        number: '',
      };

      this.employerForm.get('country').setValue('Canada');
      this.employerForm.get('employerPhoneNumber').setValue(employerPhone);
      this.employerForm.get('provinceState').setValue('Ontario');
    }


    const userData = JSON.parse(sessionStorage.getItem('claim'));

    if (!this.pastEmployerInfo && !userData?.employmentInformation) {
      const localstoragejsonData = JSON.parse(sessionStorage.getItem('employmentData'));

      if (localstoragejsonData) {
        this.employerForm.get('employerAddress').setValue(localstoragejsonData.employerAddress);
        this.employerForm.get('employerName').setValue(localstoragejsonData.employerName);

        if (localstoragejsonData.employerAddress) {
          const countynamearray = localstoragejsonData.employerAddress.split(', ');
          const newCounty = countynamearray[countynamearray.length - 1];
          this.employerForm.get('country').setValue(countynamearray[countynamearray.length - 1]);

          const countrycode = this.countryCodeData.allCountries.find(x => {
            return String(x[0]).toLowerCase().split('(')[0].trim() === newCounty.toLowerCase().split('(')[0].trim();
          });


          const phone2 = {
            number: localstoragejsonData.employerPhoneNumber,
            countryCode: countrycode ? countrycode[countrycode.length - 1] : null,
          };

          this.employerForm.get('employerPhoneNumber').setValue(phone2);
        }

      }
    }


    if (this.pastEmployerInfo && !this.pastEmployerInfo.toolsUsedList) {
      this.tools = [];
    }


    if (this.pastEmployerInfo) {

      this.employerForm.value.employerPhoneNumber = this.pastEmployerInfo.employerPhoneNumber;


      if (this.employerForm.value.employerAddress) {


        const countyNameArray = this.employerForm.value.employerAddress.split(', ');
        const newCounty = countyNameArray[countyNameArray.length - 1];
        this.employerForm.get('country').setValue(countyNameArray[countyNameArray.length - 1]);

        const countryCode = this.countryCodeData.allCountries.find(x => {
          return String(x[0]).toLowerCase().split('(')[0].trim() === newCounty.toLowerCase().split('(')[0].trim();
        });

        if (this.pastEmployerInfo.employerPhoneNumber) {

          // const setNumber = this.pastEmployerInfo.employerPhoneNumber.split(' ');
          const phone1 = {
            number: this.pastEmployerInfo.employerPhoneNumber,
            countryCode: countryCode ? countryCode[countryCode.length - 1] : null,
          };

          this.employerForm.get('employerPhoneNumber').setValue(phone1);
        }
        else {
          const phone = {
            number: '',
            countryCode: countryCode ? countryCode[countryCode.length - 1] : null,
          };
          this.employerForm.get('employerPhoneNumber').setValue(phone);
        }
      }
    }


    if (this.pastEmployerInfo) {


      let countryCode = null;
      if (this.pastEmployerInfo.country) {
        countryCode = this.countryCodeData.allCountries.find(x => {
          return String(x[0]).toLowerCase().split('(')[0].trim() === this.pastEmployerInfo.country.toLowerCase().split('(')[0].trim();
        });
        if (!countryCode) {
          countryCode = this.countryCodeData.allCountries.find(x => {
            return String(x[0]).toLowerCase().split('(')[0].trim().indexOf(this.pastEmployerInfo.country.toLowerCase().split('(')[0].trim()) > -1;
          });
        }
      }

      let employerPhone = null;
      // if (this.pastEmployerInfo.employerPhoneNumber) {
      //   employerPhone = {
      //     "number": this.pastEmployerInfo.employerPhoneNumber,
      //     "countryCode": countryCode ? countryCode[1] : null
      //   }
      // }
      if (this.pastEmployerInfo.employerPhoneNumber) {
        const employerPhonesplitted = this.pastEmployerInfo.employerPhoneNumber.split(' ');
        employerPhone = {
          number: employerPhonesplitted ? employerPhonesplitted[1] : null,
          countryCode: countryCode ? countryCode[1] : null
        };
      }

      this.employerForm.patchValue({
        employerAddress: this.pastEmployerInfo.employerAddress,
        provinceState: this.pastEmployerInfo.provinceOrState,
        stillInBusiness: this.pastEmployerInfo.isEmployerInBusiness,
        employerName: this.pastEmployerInfo.employerName,
        employedTo: this.pastEmployerInfo.employmentEndDate,
        employedFrom: this.pastEmployerInfo.employmentStartDate,
        jobTitle: this.pastEmployerInfo.jobTitle,
        country: this.pastEmployerInfo.country,
        employerPhoneNumber: employerPhone,
      })

      this.employedToMinimumDate = new Date(this.pastEmployerInfo.employmentStartDate);

      this.todate = new Date(this.pastEmployerInfo.employmentEndDate);
      // this.employerForm.get('employerAddress').setValue(this.pastEmployerInfo.employerAddress);
      // this.employerForm.get('stillInBusiness').setValue(this.pastEmployerInfo.isEmployerInBusiness);
      // this.employerForm.get('employerName').setValue(this.pastEmployerInfo.employerName);
      // this.employerForm.get('employedTo').setValue(this.pastEmployerInfo.employmentEndDate);
      // this.employerForm.get('employedFrom').setValue(this.pastEmployerInfo.employmentStartDate);
      // this.employerForm.get('jobTitle').setValue(this.pastEmployerInfo.jobTitle);
      // this.employerForm.get('country').setValue(this.pastEmployerInfo.country);
      // this.employerForm.get('provinceState').setValue(this.pastEmployerInfo.provinceOrState);
      // this.employerForm.get('employerPhoneNumber').setValue(employerPhone);

      this.employerForm.get('employedTo').enable();
      this.fromdate = new Date(this.pastEmployerInfo.employmentStartDate);
      this.todate = new Date(this.pastEmployerInfo.employmentEndDate);
      this.tools = this.pastEmployerInfo.toolsUsedList;

    }

    this.checkCountry();
    this.updateCountryList();

  }

  // setEmployedToMinimumDate = (event) => {

  //   if (event.target.value) {
  //     let minDate = event.target.value._i;
  //     this.employedToMinimumDate = new Date(minDate.year, minDate.month, minDate.date);
  //     this.employerForm.get('employedTo').enable();
  //   }
  //   else
  //     this.employerForm.get('employedTo').disable();
  // }


  toDateCheck(event, field) {
    if (!event.target.value) {
      this.dateCheck = true;
      return;
    }
    let toDate;
    let fromDate;
    let from;
    let to;
    if (field === 'from') {
      from = event.target.value._i;
      if (from.year) {
        fromDate = new Date(from.year, from.month, from.date);
      } else {
        fromDate = new Date(from);
      }
      this.employedToMinimumDate = fromDate;
      this.fromdate = fromDate;
      this.employerForm.get('employedTo').enable();
    } else {
      to = event.target.value._i;
      if (to.year) {
        toDate = new Date(to.year, to.month, to.date);
      } else {
        toDate = new Date(to);
      }
      this.todate = toDate;
    }
    if (this.todate && this.fromdate > this.todate) {

      this.isfromdate = true;
    }
    else {
      this.isfromdate = false;
    }

    if (this.employedToMinimumDate <= this.todate) {
      this.dateCheck = true;
    } else {
      this.dateCheck = false;

    }
  }

  manage(txt) {
    const bt = document.getElementById('btSubmit');
    if (txt.value !== '') {
      // console.log('disable false');
    }
    else {
      // console.log('disable true');
    }
  }

  onToolsListSubmit = () => {

    this.istoolform = true;

    this.toolsForm.markAllAsTouched();


    if (this.toolInput.valid) {
      this.toolsForm.get('toolName').setValue(this.toolInput.value);
    }

    if (this.toolsForm.get('hoursUsed').value && this.toolsForm.get('hoursUsed').value.match(/\./g)) {
      var count = (this.toolsForm.get('hoursUsed').value.match(/\./g).length);
      if (count > 1) {
        this.isNumber = true;
        return;
      }
      else if (count == 1 && !this.toolsForm.valid) {
        this.isNumber = true;
        return;
      }
      else { this.isNumber = false; }
    }

    if (this.toolsForm.valid) {
      // if (!this.isInValidHrs()) {
      const hoursUsed = this.toolsForm.get('hoursUsed').value;
      if (hoursUsed > 24 || hoursUsed < 0.1) {
        return;
      }

      // if (10 >= this.tools.length) {
      const toolList: Tools = {
        toolName: this.toolsForm.get('toolName').value,
        hoursUsed: this.toolsForm.get('hoursUsed').value,
        // hoursUsed: parseFloat((this.toolsForm.get('hoursUsed').value).toFixed(2))
      };

      this.tools = [...this.tools, toolList];
      // console.log('this.tools>>>>>>>>', this.tools)
      this.toolsForm.reset();
      this.toolInput.reset();

      this.getToolFiltered();



      // } else {
      //   this.toolListOverLimit = true;
      //   this.toolsForm.reset();
      //   // console.log('over limit<<<<<<<<', this.toolListOverLimit)
      // }
      // }
    } else {
      this.validationService.validateAllFormFields(this.toolsForm);
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


  /**
   * @author Deivid Mafra;
   * @date 08/16/2020;
   * @remarks Method responsible for adding the end-user past employment information based on claimId.
   * It retrieves the entire claim object and storage it in the session storage.
   */

  addOrUpdatePastEmploymentInfo = () => {
    this.issubmitForm = true;

    // if (this.toolsForm.get('toolName').touched || this.toolsForm.get('hoursUsed').touched) {
    //   if (this.toolsForm.get('toolName').value == null || this.toolsForm.get('hoursUsed').value == null) {
    //     this.onToolsListSubmit();
    //     this.istoolform = false;
    //     return;
    //   }
    //   else {
    //     this.istoolform = true;
    //   }
    //   console.log(this.toolsForm.get('toolName').touched);
    //   console.log(this.toolsForm.get('hoursUsed').touched);
    // }
    if (this.toolInput.valid) {
      this.toolsForm.get('toolName').setValue(this.toolInput.value);
    }
    if (!this.toolsForm.get('toolName').value && !this.toolsForm.get('hoursUsed').value) {
      this.issubmit = false;
    }
    else if (!this.toolsForm.get('toolName').value && this.toolsForm.get('hoursUsed').value) {
      this.issubmit = true;
      return;
    }
    else if (this.toolsForm.get('toolName').value && !this.toolsForm.get('hoursUsed').value) {
      this.issubmit = true;
      return;
    }
    else {
      this.issubmit = false;
    }

    if (this.toolsForm.get('hoursUsed').value && this.toolsForm.get('hoursUsed').value.match(/\./g)) {
      var count = (this.toolsForm.get('hoursUsed').value.match(/\./g).length);
      if (count > 1) {
        this.isNumber = true;
        return;
      }
      else if (count == 1 && !this.toolsForm.valid) {
        this.isNumber = true;
        return;
      }
      else { this.isNumber = false; }
    }

    this.employerForm.markAllAsTouched();
    this.invalidHours = (this.toolsForm.value.toolName && !this.toolsForm.value.hoursUsed) ? true : false;
    if (this.employerForm.valid && this.dateCheck && !this.invalidHours) {

      this.onToolsListSubmit();


      let employerphonenumber = this.employerForm.get('employerPhoneNumber').value;
      // if (employerPhoneNumber) {
      //   employerPhoneNumber = employerPhoneNumber.number;
      // }
      if (employerphonenumber) {
        employerphonenumber = '(' + employerphonenumber.dialCode + ')' + ' ' + employerphonenumber.number;
      }
      const pastEmploymentInfo: PastEmployerInfoDTO = {
        employerAddress: this.employerForm.get('employerAddress').value,
        employerInBusiness: this.employerForm.get('stillInBusiness').value,
        employerName: this.employerForm.get('employerName').value,
        employmentEndDate: _moment(this.employerForm.get('employedTo').value).format('YYYY-MM-DD'),
        employmentStartDate: _moment(this.employerForm.get('employedFrom').value).format('YYYY-MM-DD'),
        jobTitle: this.employerForm.get('jobTitle').value,
        country: this.employerForm.get('country').value,
        provinceOrState: this.parseProvinceStateCode(this.employerForm.get('provinceState').value),
        employerPhoneNumber: employerphonenumber,
        toolsUsed: this.tools,
      };
      this.issubmit = false;
      this.lowerthanZero = false;
      this.greterthantwentyfor = false;
      this.greterthantwentyfor = false;
      this.isNumber = false;
      this.invalidHours = false;
      this.addOrUpdatePastEmployment.emit(pastEmploymentInfo);
      this.employerForm.reset({
        country: 'India',
        employerPhoneNumber: null,
        provinceState: null,
        employerName: null
      });
      setTimeout(() => {
        // const employerPhone = {
        //   "number": '',
        // }
        this.employerForm.get('country').setValue('Canada');
        // this.employerForm.get('employerPhoneNumber').setValue(employerPhone);
        this.employerForm.get('provinceState').setValue('Ontario');
      }, 0);
      setTimeout(() => {
        this.employerForm.reset();
      }, 0);

      this.cancelBtn.nativeElement.click();
      this.issubmitForm = false;

    }
  }

  getProvince(address) {
    for (let i = 0; 1 < address.address_components.length; i++) {
      if (address.address_components[i] && address.address_components[i].types[0] === 'administrative_area_level_1') {
        return address.address_components[i].long_name;
      }
    }
  }

  resetAddressFields() {
    this.employerForm.get('employerAddress').setValue('');
    this.employerForm.get('provinceState').setValue('');
    this.employerForm.get('country').setValue('');
  }


  addressChange(address: any) {
    // console.log('adas sadasd', address.address_components);
    // this.checkCountry();
    /*this.myInformationForm.get('provinceState').setValue(''); */
    // if (this.employerForm.get('employerAddress') != null &&
    //   this.employerForm.get('country') != null) {
    //   this.resetAddressFields();
    // }

    const newProvince = this.getProvince(address);

    this.employerForm.get('employerAddress').setValue(address.formatted_address);

    const countyNameArray = address.formatted_address.split(', ');
    this.employerForm.get('country').setValue(countyNameArray[countyNameArray.length - 1]);
    const provinceStateNameArray = address.formatted_address.split(', ');


    // this.checkCountry();
    const splitAddress = address.formatted_address.split(',');
    const cleanSplitAddress: any = splitAddress.map(item => item.trim());
    const splitPostalCode = cleanSplitAddress[cleanSplitAddress?.length - 2]?.split(' ');
    if (cleanSplitAddress[cleanSplitAddress?.length - 1] === 'Canada' || cleanSplitAddress[cleanSplitAddress?.length - 1] === 'USA') {
      this.isCanadaOrUsa = true;
      this.employerForm.get('provinceState').setValue(splitPostalCode[0]);
      this.checkCountry();
    } else {
      this.isCanadaOrUsa = false;
      const countryReturned = cleanSplitAddress.pop();
      // this.employerForm.get('country').setValue(countryReturned);
      this.checkCountry();
    }
    // const splitAddress = address.formatted_address.split(',');
    // console.log(splitAddress)
    // const cleanSplitAddress = splitAddress.map(item => item.trim());
    // const splitPostalCode = cleanSplitAddress[2]?.split(' ');
    // console.log(cleanSplitAddress);

    // this.employerForm.get('employerAddress').setValue(address.formatted_address);
    // // if (cleanSplitAddress[0].includes('-')) {
    // //   const newSplit = cleanSplitAddress[0].split('-');
    // //   this.employerForm.get('employerAddress').setValue(newSplit[1]);
    // // } else {
    // //   this.employerForm.get('employerAddress').setValue(cleanSplitAddress[0]);
    // // }

    // if (cleanSplitAddress[3] === 'Canada' || cleanSplitAddress[3] === 'USA') {
    //   this.isCanadaOrUsa = true;
    //   // this.inputValue = '+1';
    //   this.employerForm.get('country').setValue(cleanSplitAddress[3]);
    //   this.checkCountry();
    //   this.employerForm.get('provinceState').setValue(splitPostalCode[0]);
    //   // splitPostalCode[2] != null ? this.employerForm.get('postalCode').setValue(splitPostalCode[1] + ' ' + splitPostalCode[2]) :
    //   //   this.employerForm.get('postalCode').setValue(splitPostalCode[1]);

    // } else {
    //   this.isCanadaOrUsa = false;
    //   const countryReturned = cleanSplitAddress.pop();
    //   this.employerForm.get('country').setValue(countryReturned);
    //   this.employerForm.get('provinceState').setValue('');
    //   this.checkCountry();
    // }


    if (this.employerForm.get('employerPhoneNumber').value) {
      const phone1Data = this.employerForm.get('employerPhoneNumber').value;
      const phone1 = {
        number: phone1Data.number,
        countryCode: phone1Data.dialCode
      };
      this.employerForm.get('employerPhoneNumber').setValue(phone1);
    }
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
      'has-error': (field !== 'hoursUsed') ? this.isFieldValid(form, field) : (this.isFieldValid(form, field))
    };
  }

  cancelEmploymentInfo = () => {
    this.employerForm.reset();
    this.toolsForm.reset();
    this.tools = [];
    this.issubmit = false;
    this.lowerthanZero = false;
    this.greterthantwentyfor = false;
    this.greterthantwentyfor = false;
    this.isNumber = false;
    this.invalidHours = false;
    this.employerForm.get('employedTo').disable();
    this.employerForm.markAsUntouched();

  }




  isInvalidtool = (value) => {

    if (value) {
      this.isTool = true;
    } else {
      this.isTool = false;
      this.issubmit = false;
    }
  }


  isInValidHrs = (value) => {

    const format = /[A-Za-z `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    this.isNumber = format.test(this.toolsForm.get('hoursUsed').value);

    var n = /[.!?]$/.test(value);


    if (n == true) {
      if (!this.checkDot) {
        this.isNumber = false;
      } else { this.isNumber = true; }
      this.checkDot = true;
    } else { this.checkDot = false; }
    if (format.test(this.toolsForm.get('hoursUsed').value) || this.isNumber) {
      this.isNumber = true;
    }

    if (n) {
      var count = (value.match(/\./g).length);
      count > 1 || format.test(this.toolsForm.get('hoursUsed').value) ? this.isNumber = true : this.isNumber = false;
    }

    if (this.toolsForm.valid) {
      this.istoolform = true;
    }

    if (this.toolsForm) {
      const hoursUsed = value;

      if (hoursUsed > 24 || hoursUsed == null) {
        this.lowerthanZero = false;
        this.greterthantwentyfor = true;
      }
      if (hoursUsed < 0.1 || hoursUsed == null) {
        this.lowerthanZero = true;
        this.greterthantwentyfor = false;
      }
      if (hoursUsed >= 0.1 && hoursUsed <= 24) {
        this.lowerthanZero = false;
        this.greterthantwentyfor = false;
      }
    }

    if (!this.toolsForm.get('hoursUsed').value) {
      this.issubmit = false;
      this.lowerthanZero = false;
      this.greterthantwentyfor = false;
      this.greterthantwentyfor = false;
      this.isNumber = false;
      this.invalidHours = false;
    }
  }


  // private getAllTools = () => {

  //   let engTools: string[] = [];
  //   let frcTools: string[] = [];

  //   this.pastEmploymentService.getAllTools().subscribe(
  //     res => {

  //       if (sessionStorage.getItem('currentLang') == 'en') {
  //         console.log('ENGLISH', this.currentLang);

  //         for (let i = 0; i < res.length; i++) {
  //           engTools.push(res[i].toolEnName);
  //         }
  //         this.toolList = engTools;
  //         console.log('this.toolList', this.toolList)
  //       } else {
  //         console.log('FRENCH', this.currentLang);
  //         for (let i = 0; i < res.length; i++) {
  //           frcTools.push(res[i].toolFrName);
  //         }
  //         this.toolList = frcTools;
  //         console.log('this.toolList in french', this.toolList)
  //       }
  //       this.getToolFiltered();
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  //   // }
  // }

  getToolFiltered = () => {
    this.filteredOptions = this.toolInput.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.predefinedToolList.filter(option => option.toLowerCase().includes(filterValue));
    }
  }


  /*double check */
  onToolsListdelete = (item: Tools) => {
    const index = this.tools.findIndex((x: Tools) => x === item);
    this.tools.splice(index, 1);
  }

  validateFutureDate(event, item?) {
    this.futureDateErrorFrom = false;
    this.futureDateErrorTo = false;
    // let year = (event.target.value).split(' ').pop();

    let empdateDate = new Date(event.target.value);
    let currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    if (empdateDate > currentDate) {
      if (item === 'employedFrom') {
        this.futureDateErrorFrom = true;
        this.futureDateErrorTo = false;
      }
      if (item === 'employedTo') {
        this.futureDateErrorFrom = false;
        this.futureDateErrorTo = true;
      }
    } else {
      this.futureDateErrorFrom = false;
      this.futureDateErrorTo = false;
    }

    if (this.employerForm.value.employedFrom._i) {
      const fromDate = this.employerForm.value.employedFrom._i;
      empdateDate = new Date(fromDate);
      // let year = (fromDate.toString()).split(' ').pop();
      if (empdateDate > currentDate) {
        this.futureDateErrorFrom = true;
      } else { this.futureDateErrorFrom = false; }
    }
    if (this.employerForm.value.employedTo._i) {
      const fromTo = this.employerForm.value.employedTo._i;
      // let year = (fromTo.toString()).split(' ').pop();
      empdateDate = new Date(fromTo);
      if (empdateDate > currentDate) {
        this.futureDateErrorTo = true;
      } else { this.futureDateErrorTo = false; }
    }

    if (item === 'employedFrom') {
      this.datevalue1 = event.target.value.length;
      this.validemployedFrom = this.IsValidDate(event.target.value);
    }

    if (item === 'employedTo') {
      this.datevalue2 = event.target.value.length;
      this.validemployedTo = this.IsValidDate(event.target.value);
    }
  }

  checkDate(value, item?) {
    this.dateCheck = true;
    //  this.validateFutureDate2(value);
    if (item === 'employedFrom') {
      this.datevalue1 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.employerForm.get('employedFrom').setValue('');
        }
      }

      this.validemployedFrom = this.IsValidDate(value);
    }
    if (item === 'employedTo') {
      this.datevalue2 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.employerForm.get('employedTo').setValue('');
        }
      }

      this.validemployedTo = this.IsValidDate(value);
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
