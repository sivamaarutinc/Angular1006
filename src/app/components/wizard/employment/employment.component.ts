import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EmploymentInfo } from 'src/app/models/employmentInfo';
import { EmploymentInfoService } from 'src/app/services/employment-info.service';
import { Claim } from 'src/app/models/claim';
import { ValidationService } from 'src/app/services/validation.service';
import { PastEmployerInfo } from 'src/app/models/pastEmployerInfo';
import { PastEmploymentInfoService } from 'src/app/services/past-employment-info.service';
import { PastEmployerInfoDTO } from 'src/app/DTOs/PastEmployerInfoDTO';
import { PredefinedToolList } from 'src/app/models/predefinedToolList';
import { AddEmployerModalComponent } from './add-employer-modal/add-employer-modal.component';
import * as _moment from 'moment';
import { TimeoutService } from 'src/app/services/timeout.service';
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
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ]
})

/* This class is responsible for gathering info about past employement or current employement. */
export class EmploymentComponent implements OnInit, OnChanges {

  // @Output() next: EventEmitter<void> = new EventEmitter();

  @ViewChild('pastEmployment', { static: false }) pastEmployment: AddEmployerModalComponent;
  @Output() showSuccess: EventEmitter<boolean> = new EventEmitter();
  public iscommonerrormsg: boolean = false;

  @ViewChild("currentEmployerAddress")
  public currentEmployerAddressElementRef: ElementRef;

  @ViewChild("yourBusinessAddress")
  public yourBusinessAddressElementRef: ElementRef;

  employmentForm = new FormGroup({
    isRetired: new FormControl('', Validators.required),
    retirementDate: new FormControl(''),
    isEmployed: new FormControl(''),
    currentEmployerName: new FormControl('', Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)),
    currentEmployerAddress: new FormControl(''),
    currentEmployerPhone: new FormControl(''),
    isHazardousNoise: new FormControl(''),
    currentSituation: new FormControl('', Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)),

    wasSelfEmployed: new FormControl('', Validators.required),

    hasInsurance: new FormControl(''),

    yourBusinessName: new FormControl('', Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)),
    yourBusinessAddress: new FormControl(''),
    yourBusinessFrom: new FormControl(''),
    yourBusinessTo: new FormControl({ value: '', disabled: true }),

    noisyMachineryOffwork: new FormControl('', Validators.required),
    noisyMachineryDescription: new FormControl(''),
    pastEmployerarr: new FormControl('', Validators.required),

  });

  public isRetired: boolean = false;
  public isCurrentEmployed: boolean = false;
  public isEmployed: boolean = true;
  public showCurrentEmployed: boolean = false;
  public selfEmployed: boolean = false;
  public showYourBusiness: boolean = false;
  public usedNoisyMachinery: boolean = false;
  public futureDateError: boolean = false;
  public isEdit: boolean = false;
  public isPastEmploye: boolean = true;
  public maxDate = new Date();
  public minDate = '';
  public is16: boolean = false;
  public businessMinimumDate: Date;
  public pastEmployerInfo: PastEmployerInfo;
  public predefinedToolList: Array<string> = new Array<string>();
  // public predefinedToolList: Array<PredefinedToolList> = new Array<PredefinedToolList>();
  public pastEmploymentList: Array<PastEmployerInfo>;
  public fromdate: Date;
  public todate: Date;
  public isfromdate: boolean = false;
  public dateCheck: boolean = true;
  public validretirementDate: boolean = true;
  public validyourBusinessFrom: boolean = true;
  public validyourBusinessTo: boolean = true;
  public datevalue1: any;
  public datevalue2: any;
  public datevalue3: any;
  get firstPastEmploymentInfoId(): any {
    return sessionStorage.getItem('firstPastEmploymentInfoId');
  }
  @Input() public claimId: number;
  @Input() public referenceNumber: string;
  @Input() public employmentInfo: EmploymentInfo;
  @Input() set resultofSaveonExit(value: string) {
    this.saveData(value);
  }


  @Output() formStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() employmentSaved: EventEmitter<boolean> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() saveDataonExit1: EventEmitter<any> = new EventEmitter();

  constructor(
    private employmentService: EmploymentInfoService,
    private pastEmploymentService: PastEmploymentInfoService,
    private validationService: ValidationService,
    private timeout: TimeoutService,
    public googleplaces: DynamicScriptsService,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {


    this.loadEmploymentInfo();
    this.checkNullForm();
    // this.getAllTools();
    this.retiredValidation();
    this.employedValidation();
    this.selfEmpValidation();
    this.insuranceValidation();
    this.machineValidation();

    const userData = JSON.parse(sessionStorage.getItem('claim'));

    if (userData && userData.personalInformation) {
      const birthDate = userData.personalInformation.dateOfBirth;
      const minExperienceDate = birthDate.split('-');
      const plusSixteen = +minExperienceDate[0] + 16;

      this.minDate = plusSixteen + '-' + minExperienceDate[1] + '-' + minExperienceDate[2];

    }

    if (this.employmentInfo && this.employmentInfo.pastEmploymentInformationList.length) {
      this.mapEmployerData();
    } else {
      this.employmentForm.get('currentEmployerAddress').setValue('');
      this.employmentForm.get('currentEmployerName').setValue('');
      this.employmentForm.get('currentEmployerPhone').setValue('');
    }
  }

  currentEmployerAddress() {
    setTimeout(() => {
      this.googleplaces.api.then(maps => {
        this.initAutocomplete(maps, this.currentEmployerAddressElementRef.nativeElement, 0);
      });
    }, 200);
  }

  yourBusinessAddress() {
    setTimeout(() => {
      this.googleplaces.api.then(maps => {
        this.initAutocomplete(maps, this.yourBusinessAddressElementRef.nativeElement, 1);
      });
    }, 200);
  }


  initAutocomplete(maps: Maps, element, indx) {
    let autocomplete = new maps.places.Autocomplete(element);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        if (indx === 0) {
          this.currentEmployerAddressChange(autocomplete.getPlace());
        }
        else {
          this.addressChange(autocomplete.getPlace());
        }

      });
    });
  }




  ngOnChanges() {
    this.timeout.componentMethodCalled.subscribe((resp) => {
      if (resp === '2') {
        this.addOrUpdateEmploymentInfo(false, false, false, false);
      }
    });
  }



  saveData(name) {
    if (sessionStorage.getItem('component') === '2') {
      if (name === 'exitemployment') {

        this.addOrUpdateEmploymentInfo(false, false, false, true);

        if (!this.employmentForm.valid || !this.pastEmploymentList.length) {
          this.saveDataonExit1.emit();
        }
      }
    }
  }

  hasWhiteSpace(value) {
    return /\s/g.test(value);
  }

  validateFutureDate2(value) {
    if (this.hasWhiteSpace(value)) {
      const year = (value).substr(value.length - 4);

      const DOB = sessionStorage.getItem('dateOfBirth');
      const DOB1 = new Date(DOB).getFullYear() + 16;

      if (year < DOB1) {
        this.is16 = true;
      } else { this.is16 = false; }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      if (typeof (year) === 'number') {
        if (year > currentYear) {
          this.futureDateError = true;
        }
      } else { this.futureDateError = false; }

      if (year > currentYear) {
        this.futureDateError = true;
      }
      else { this.futureDateError = false; }
    }

  }

  validateFutureDate(event, item?) {

    if (this.hasWhiteSpace(event.target.value)) {
      const year = (event.target.value).substr(event.target.value.length - 4);

      const DOB = sessionStorage.getItem('dateOfBirth');
      const DOB1 = new Date(DOB).getFullYear() + 16;

      if (year <= DOB1) {
        this.is16 = true;
      } else { this.is16 = false; }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      if (year > currentYear) {
        this.futureDateError = true;
      }
    } else { this.futureDateError = false; }

    if (item === 'retirementDate') {
      this.datevalue1 = event.target.value.length;
      this.validretirementDate = this.IsValidDate(event.target.value);
    }
    if (item === 'yourBusinessFrom') {
      this.datevalue2 = event.target.value.length;
      this.validyourBusinessFrom = this.IsValidDate(event.target.value);
    }
    if (item === 'yourBusinessTo') {
      this.datevalue3 = event.target.value.length;
      this.validyourBusinessTo = this.IsValidDate(event.target.value);
    }

  }

  // mapEmployerData() {
  //   this.employmentForm.get('currentEmployerAddress').setValue(this.employmentInfo.pastEmploymentInformationList[0].employerAddress);
  //   this.employmentForm.get('currentEmployerName').setValue(this.employmentInfo.pastEmploymentInformationList[0].employerName);

  //   const newNumber = this.employmentInfo.pastEmploymentInformationList[0].employerPhoneNumber;
  //   if (newNumber) {
  //     const setNumber = newNumber.split(' ');
  //     this.employmentForm.get('currentEmployerPhone').setValue(setNumber[1]);
  //   }


  // }
  mapEmployerData() {
    for (let i = 0; i < this.employmentInfo.pastEmploymentInformationList.length; i++) {
      if ((this.employmentInfo.pastEmploymentInformationList[i].pastEmploymentInfoId).toString() == sessionStorage.getItem('firstPastEmploymentInfoId')) {
        this.employmentForm.get('currentEmployerAddress').setValue(this.employmentInfo.pastEmploymentInformationList[i].employerAddress);
        this.employmentForm.get('currentEmployerName').setValue(this.employmentInfo.pastEmploymentInformationList[i].employerName);
        const newNumber = this.employmentInfo.pastEmploymentInformationList[i].employerPhoneNumber;
        if (newNumber) {
          const setNumber = newNumber.split(' ');
          this.employmentForm.get('currentEmployerPhone').setValue(setNumber[1]);
        }
      }
    }
  }
  machineValidation = () => {
    this.employmentForm.get('noisyMachineryOffwork').valueChanges.subscribe(checked => {
      if (checked === 'true') {
        this.employmentForm.get('noisyMachineryDescription').setValidators(Validators.required);
      } else {
        this.employmentForm.get('noisyMachineryDescription').setValidators(null);
      }
      this.employmentForm.updateValueAndValidity();
    });
  }

  insuranceValidation = () => {
    this.employmentForm.get('hasInsurance').valueChanges.subscribe(checked => {
      if (checked === 'true') {
        this.employmentForm.get('yourBusinessName').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
        this.employmentForm.get('yourBusinessAddress').setValidators(Validators.required);
        this.employmentForm.get('yourBusinessFrom').setValidators(Validators.required);
        this.employmentForm.get('yourBusinessTo').setValidators(Validators.required);
      } else {
        this.employmentForm.get('yourBusinessName').setValidators(null);
        this.employmentForm.get('yourBusinessAddress').setValidators(null);
        this.employmentForm.get('yourBusinessFrom').setValidators(null);
        this.employmentForm.get('yourBusinessTo').setValidators(null);
      }
      this.employmentForm.updateValueAndValidity();
    });
  }

  selfEmpValidation = () => {
    this.employmentForm.get('wasSelfEmployed').valueChanges.subscribe(checked => {
      if (checked === 'true') {
        this.employmentForm.get('hasInsurance').setValidators(Validators.required);
      } else {
        this.employmentForm.get('hasInsurance').setValidators(null);
      }
      this.employmentForm.updateValueAndValidity();
    });
  }

  retiredValidation = () => {
    this.employmentForm.get('isRetired').valueChanges.subscribe(checked => {
      if (checked === 'true') {
        this.employmentForm.get('retirementDate').setValidators(Validators.required);

        const employed: string = this.employmentForm.get('isEmployed').value;

        if (employed === 'true') {
          this.employmentForm.get('isEmployed').setValue(null);
          this.employmentForm.get('currentEmployerName').setValue(null);
          this.employmentForm.get('currentEmployerAddress').setValue(null);
          this.employmentForm.get('currentEmployerPhone').setValue(null);
          this.employmentForm.get('isHazardousNoise').setValue(null);


          this.employmentForm.get('isEmployed').setValidators(null);
          this.employmentForm.get('currentEmployerName').setValidators(null);
          this.employmentForm.get('currentEmployerAddress').setValidators(null);
          this.employmentForm.get('currentEmployerPhone').setValidators(null);
          this.employmentForm.get('isHazardousNoise').setValidators(null);
        }

        if (employed === 'false') {
          this.employmentForm.get('currentSituation').setValue('');

          this.employmentForm.get('isEmployed').setValidators(null);
          this.employmentForm.get('currentSituation').setValidators(null);
        }

      } else {
        this.employmentForm.get('retirementDate').setValidators(null);
        this.employmentForm.get('isEmployed').setValidators(Validators.required);
      }
      this.employmentForm.updateValueAndValidity();
    });
  }

  employedValidation = () => {
    this.employmentForm.get('isEmployed').valueChanges.subscribe(checked => {
      if (checked === 'true') {
        this.employmentForm.get('currentEmployerName').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
        this.employmentForm.get('currentEmployerAddress').setValidators(Validators.required);
        this.employmentForm.get('currentEmployerPhone').setValidators(Validators.required);
        this.employmentForm.get('isHazardousNoise').setValidators(Validators.required);
        this.employmentForm.get('currentSituation').setValidators(null);
      } else {
        this.employmentForm.get('currentEmployerName').setValidators(null);
        this.employmentForm.get('currentEmployerAddress').setValidators(null);
        this.employmentForm.get('currentEmployerPhone').setValidators(null);
        this.employmentForm.get('isHazardousNoise').setValidators(null);
        this.employmentForm.get('currentSituation').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
      }
      this.employmentForm.updateValueAndValidity();
    });
  }

  checkNullForm = () => {
    if (
      this.employmentForm.get('isRetired').value === '' ||
      this.employmentForm.get('isEmployed').value === '' ||
      this.employmentForm.get('wasSelfEmployed').value === '' ||
      this.employmentForm.get('noisyMachineryOffwork').value === '' ||
      this.employmentForm.get('retirementDate').value === '' ||
      this.employmentForm.get('currentSituation').value === '' ||
      this.employmentForm.get('currentEmployerName').value === '' ||
      this.employmentForm.get('currentEmployerAddress').value === '' ||
      this.employmentForm.get('currentEmployerPhone').value === '' ||
      this.employmentForm.get('hasInsurance').value === '' ||
      this.employmentForm.get('yourBusinessName').value === '' ||
      this.employmentForm.get('yourBusinessAddress').value === '' ||
      this.employmentForm.get('yourBusinessFrom').value === '' ||
      this.employmentForm.get('yourBusinessTo').value === '' ||
      this.employmentForm.get('isHazardousNoise').value === '' ||
      this.employmentForm.get('noisyMachineryDescription').value === ''
    ) {
      // console.log('one field is empty on employmentForm');
      this.formStatus.emit(false);
    } else {
      this.formStatus.emit(true);
      // console.log('all fields okay in employmentForm');
    }
  }

  checkRetired = () => {
    const retired: string = this.employmentForm.get('isRetired').value;

    if (retired === 'true') {
      this.setRetired();
    }

    if (retired === 'false') {
      this.setNotRetired();
    }
  }

  checkEmployed = () => {
    const employed: string = this.employmentForm.get('isEmployed').value;

    if (employed === 'true') {
      this.setEmployed();
    }

    if (employed === 'false') {
      this.setNotEmployed();
    }
  }

  setRetired = () => {

    const employed: string = this.employmentForm.get('isEmployed').value;
    if (employed === 'false') {
      this.employmentForm.get('currentSituation').setValue('');
      this.employmentForm.get('currentSituation').setValidators(null);
      this.employmentForm.updateValueAndValidity();
    }

    this.isRetired = true;
    this.isEmployed = true;
    this.isCurrentEmployed = false;
    this.showCurrentEmployed = false;
    this.employmentForm.get('isEmployed').setValue(null);
    // this.employmentForm.get('isEmployed').setValidators(null);
    // this.employmentForm.get('currentSituation').setValue(null);
    // this.employmentForm.get('currentSituation').setValidators(null);
    // this.employmentForm.updateValueAndValidity();
    //current situation
  }

  setNotRetired = () => {
    this.isRetired = false;

    this.isEmployed = true;
    this.isCurrentEmployed = true;
    this.employmentForm.get('retirementDate').setValue('');
  }

  setEmployed = () => {
    this.isEmployed = true;

    this.showCurrentEmployed = true;
    this.employmentForm.get('currentSituation').setValue(null);
    this.currentEmployerAddress();
    if (this.employmentInfo && this.employmentInfo.pastEmploymentInformationList && this.employmentInfo.pastEmploymentInformationList.length) {
      this.mapEmployerData();
    }
  }

  setNotEmployed = () => {
    this.isEmployed = false;
    // console.log("setNotEmployed" + this.employmentForm.get('currentSituation').value)
    this.employmentForm.get('currentSituation').setValidators([Validators.required, Validators.pattern(`^[A-Za-z0-9\-\Çéâêîôûàèùëïü./'#@%&:;,\\n ]*$`)]);
    // this.employmentForm.get('currentSituation').setValue(null);
    this.showCurrentEmployed = false;
    this.employmentForm.get('currentEmployerName').setValue(null);
    this.employmentForm.get('currentEmployerAddress').setValue(null);
    this.employmentForm.get('currentEmployerPhone').setValue(null);
    this.employmentForm.get('isHazardousNoise').setValue(null);
  }

  checkSelfEmployed = () => {
    const selfEmployed: string = this.employmentForm.get('wasSelfEmployed').value;

    if (selfEmployed === 'true') {
      this.setSelfEmployed();
    }

    if (selfEmployed === 'false') {
      this.setNotSelfEmployed();
    }
  }


  setSelfEmployed = () => {
    // console.log(this.employmentForm.get('wasSelfEmployed').value);
    this.selfEmployed = true;
  }

  setNotSelfEmployed = () => {
    // console.log(this.employmentForm.get('wasSelfEmployed').value);
    this.selfEmployed = false;
    this.showYourBusiness = false;
    this.employmentForm.get('hasInsurance').setValue(null);

    this.employmentForm.get('yourBusinessName').setValue(null);
    this.employmentForm.get('yourBusinessAddress').setValue(null);
    this.employmentForm.get('yourBusinessFrom').setValue('');
    this.employmentForm.get('yourBusinessTo').setValue('');

    this.employmentForm.get('hasInsurance').setValidators(null);
    // this.employmentForm.get('yourBusinessName').setValidators(null);
    // this.employmentForm.get('yourBusinessAddress').setValidators(null);
    // this.employmentForm.get('yourBusinessFrom').setValidators(null);
    // this.employmentForm.get('yourBusinessTo').setValidators(null);
    this.employmentForm.updateValueAndValidity();
  }

  checkHasInsurance = () => {
    const insurance: string = this.employmentForm.get('hasInsurance').value;

    if (insurance === 'true') {
      this.setInsurance();
    }

    if (insurance === 'false') {
      this.setNotInsurance();
    }
  }

  setInsurance = () => {
    // console.log(this.employmentForm.get('hasInsurance').value);
    this.showYourBusiness = true;

    if (this.employmentInfo?.selfEmpStartDate != null) {
      this.employmentForm.get('yourBusinessTo').enable();
    }
    this.yourBusinessAddress();
  }

  setNotInsurance = () => {
    this.showYourBusiness = false;
    this.employmentForm.get('yourBusinessName').setValue(null);
    this.employmentForm.get('yourBusinessAddress').setValue(null);
    this.employmentForm.get('yourBusinessFrom').setValue('');
    this.employmentForm.get('yourBusinessTo').setValue('');
    this.employmentForm.get('yourBusinessTo').disable();
  }




  setBusinessMinimumDate(event, field) {
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
      this.businessMinimumDate = fromDate;
      this.fromdate = fromDate;
      this.employmentForm.get('yourBusinessTo').enable();
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

    if (this.businessMinimumDate <= this.todate) {
      this.dateCheck = true;
    } else {
      this.dateCheck = false;
    }

  }


  // setBusinessMinimumDate = (event) => {
  //   console.log(this.employmentForm.get('yourBusinessFrom').value);

  //   if (event.target.value) {
  //     const minDate = event.target.value._i;
  //     this.businessMinimumDate = new Date(minDate.year, minDate.month, minDate.date);
  //     this.employmentForm.get('yourBusinessTo').enable();
  //   }
  //   else {
  //     this.employmentForm.get('yourBusinessTo').disable();
  //   }
  // }


  setNoisyMachinery = () => {
    this.usedNoisyMachinery = true;
  }

  setNotNoisyMachinery = () => {
    this.usedNoisyMachinery = false;
    this.employmentForm.get('noisyMachineryDescription').setValue(null);
  }

  /**
   * @author Deivid Mafra;
   * @date 08/13/2020;
   * @remarks Method responsible for adding or updating the end-user employment information based on claimId.
   * It retrieves the entire claim object and storage it in the session storage.
   */
  addOrUpdateEmploymentInfo = (isSave, alredySaved, isNext = false, isExit?) => {
    this.iscommonerrormsg = false;
    if (!this.pastEmploymentList) {
      this.isPastEmploye = false;
      this.validationService.validateAllFormFields(this.employmentForm);
      return;
    }

    if (!this.pastEmploymentList.length) {
      this.isPastEmploye = false;
      this.validationService.validateAllFormFields(this.employmentForm);
      return;
    } else {
      this.isPastEmploye = true;
    }

    if (alredySaved) {
      return;
    }

    if (this.employmentForm.valid) {
      const employmentInfo: EmploymentInfo = {
        currentEmployerAddress: this.employmentForm.get('currentEmployerAddress').value,
        currentEmployerIsHazardous: this.employmentForm.get('isHazardousNoise').value,
        currentEmployerName: this.employmentForm.get('currentEmployerName').value,
        currentEmployerPhoneNumber: this.employmentForm.get('currentEmployerPhone').value,
        currentSituation: this.employmentForm.get('currentSituation').value,
        currentlyEmployed: this.employmentForm.get('isEmployed').value,
        hasEverBeenSelfEmployed: this.employmentForm.get('wasSelfEmployed').value,
        hasRetired: this.employmentForm.get('isRetired').value,
        hasUsedNoisyEquipmentOutOfWork: this.employmentForm.get('noisyMachineryOffwork').value,
        noisyEquipmentDetails: this.employmentForm.get('noisyMachineryDescription').value,
        retirementDate: this.employmentForm.get('retirementDate').value ? _moment(this.employmentForm.get('retirementDate').value).format('YYYY-MM-DD') : '',
        selfEmpBusinessAddress: this.employmentForm.get('yourBusinessAddress').value,
        selfEmpBusinessName: this.employmentForm.get('yourBusinessName').value,
        selfEmpEndDate: this.employmentForm.get('yourBusinessTo').value ? _moment(this.employmentForm.get('yourBusinessTo').value).format('YYYY-MM-DD') : '',
        selfEmpHasInsurance: this.employmentForm.get('hasInsurance').value,
        selfEmpStartDate: this.employmentForm.get('yourBusinessFrom').value ? _moment(this.employmentForm.get('yourBusinessFrom').value).format('YYYY-MM-DD') : ' ',
      };

      const token = sessionStorage.getItem('access_token');
      this.employmentService.addOrUpdateEmploymentInfo(this.claimId, employmentInfo, token).subscribe(
        /* this.employmentService.addOrUpdateEmploymentInfo(this.claimId, this.employmentInfoObj()).subscribe( */
        (res: Claim) => {
          sessionStorage.setItem('claim', JSON.stringify(res));
          this.employmentInfo = res.employmentInformation;
          this.employmentSaved.emit(true);
          // if (save)
          this.showSuccess.emit(isSave);
          if (!isSave && isNext) {
            this.next.emit();
          }


          if (isExit) {
            sessionStorage.clear();
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
      this.validationService.validateAllFormFields(this.employmentForm);
    }
  }



  loadEmploymentInfo = () => {
    if (this.employmentInfo) {
      this.employmentForm.get('currentEmployerAddress').setValue(this.employmentInfo.currentEmployerAddress);

      if (this.employmentInfo.currentEmployerIsHazardous != null) {
        this.employmentForm.get('isHazardousNoise').setValue(this.employmentInfo.currentEmployerIsHazardous.toString());
      }

      this.employmentForm.get('currentEmployerName').setValue(this.employmentInfo.currentEmployerName);
      this.employmentForm.get('currentEmployerPhone').setValue(this.employmentInfo.currentEmployerPhoneNumber);
      this.employmentForm.get('currentSituation').setValue(this.employmentInfo.currentSituation);

      if (this.employmentInfo.currentlyEmployed != null) {
        this.employmentForm.get('isEmployed').setValue(this.employmentInfo.currentlyEmployed.toString());
      }
      if (this.employmentInfo.hasEverBeenSelfEmployed != null) {
        this.employmentForm.get('wasSelfEmployed').setValue(this.employmentInfo.hasEverBeenSelfEmployed.toString());
      }

      if (this.employmentInfo.hasRetired != null) {
        this.employmentForm.get('isRetired').setValue(this.employmentInfo.hasRetired.toString());
      }

      if (this.employmentInfo.hasUsedNoisyEquipmentOutOfWork != null) {
        this.employmentForm.get('noisyMachineryOffwork').setValue(this.employmentInfo.hasUsedNoisyEquipmentOutOfWork.toString());
      }

      this.employmentForm.get('noisyMachineryDescription').setValue(this.employmentInfo.noisyEquipmentDetails);

      if (this.employmentInfo.retirementDate === null) {
        this.employmentForm.get('retirementDate').setValue('');
      } else {
        this.employmentForm.get('retirementDate').setValue(this.employmentInfo.retirementDate);
      }

      this.employmentForm.get('yourBusinessAddress').setValue(this.employmentInfo.selfEmpBusinessAddress);
      this.employmentForm.get('yourBusinessName').setValue(this.employmentInfo.selfEmpBusinessName);

      if (this.employmentInfo.selfEmpEndDate === null) {
        this.employmentForm.get('yourBusinessTo').setValue('');
      } else {
        this.employmentForm.get('yourBusinessTo').setValue(this.employmentInfo.selfEmpEndDate);
        this.todate = new Date(this.employmentInfo.selfEmpEndDate);

      }

      if (this.employmentInfo.selfEmpStartDate === null) {
        this.employmentForm.get('yourBusinessFrom').setValue('');
      } else {
        this.employmentForm.get('yourBusinessFrom').setValue(this.employmentInfo.selfEmpStartDate);
        this.fromdate = new Date(this.employmentInfo.selfEmpStartDate);
      }

      if (this.employmentInfo.selfEmpHasInsurance != null) {
        this.employmentForm.get('hasInsurance').setValue(this.employmentInfo.selfEmpHasInsurance.toString());
      }

      if (this.employmentInfo.selfEmpHasInsurance || this.employmentInfo.selfEmpHasInsurance.toString() == 'true') {
        this.yourBusinessAddress()
      }
      if (this.employmentInfo.currentlyEmployed || this.employmentInfo.currentlyEmployed.toString() == 'true') {
        this.currentEmployerAddress()
      }

      this.checkRetired();
      this.checkEmployed();
      this.checkSelfEmployed();
      this.loadPastemployment();
      this.checkHasInsurance();
    }
  }

  deletePastEmploymentInfo = (pastEmploymentInfoId: number) => {
    const token = sessionStorage.getItem('access_token');
    this.pastEmploymentService.deletePastEmploymentInfo(this.claimId, pastEmploymentInfoId, token).subscribe(
      res => {
        sessionStorage.setItem('claim', JSON.stringify(res));
        this.employmentInfo.pastEmploymentInformationList = res.employmentInformation.pastEmploymentInformationList;
        this.pastEmploymentList = [... this.employmentInfo.pastEmploymentInformationList];

        if (!this.employmentInfo.pastEmploymentInformationList.length) {
          this.employmentForm.get('currentEmployerAddress').setValue('');
          this.employmentForm.get('currentEmployerName').setValue('');
          this.employmentForm.get('currentEmployerPhone').setValue('');
        }

        if (this.pastEmploymentList.length) {
          this.employmentForm.get('pastEmployerarr').setValue('yes');
        } else {
          this.employmentForm.get('pastEmployerarr').setValue('');
        }

      },
      error => {
        this.iscommonerrormsg = true;
        document.getElementById('commonerrormsgid').focus();
      }
    );
  }

  addOrUpdatePastEmployment = (pastEmploymentInfo: PastEmployerInfoDTO) => {

    if (!this.isEdit) {
      const token = sessionStorage.getItem('access_token');
      this.employmentService.addOrUpdateEmploymentInfo(this.claimId, this.employmentInfoObj(), token).subscribe(
        (res: Claim) => {
          this.employmentForm.get('pastEmployerarr').setValue('yes');
          sessionStorage.setItem('claim', JSON.stringify(res));
          this.employmentInfo = res.employmentInformation;
          this.handlePastEmploymentInfo(pastEmploymentInfo);
        },
        error => {
          this.iscommonerrormsg = true;
          document.getElementById('commonerrormsgid').focus();
        }
      );
    } else {
      this.handlePastEmploymentInfo(pastEmploymentInfo);
    }
  }


  addPastEmploymentInfo = () => {
    this.isEdit = false;



    if (!this.employmentInfo) {
      const tempEmployeData: any = {
        employerAddress: this.employmentForm.value.currentEmployerAddress,
        employerName: this.employmentForm.value.currentEmployerName,
        employerPhoneNumber: this.employmentForm.value.currentEmployerPhone,
      };

      sessionStorage.setItem('employmentData', JSON.stringify(tempEmployeData));
    }


    if (this.employmentInfo && this.employmentForm.value.isEmployed && !this.employmentInfo.pastEmploymentInformationList.length) {
      const pastEmployerInfo: PastEmployerInfo = {
        employerAddress: this.employmentForm.value.currentEmployerAddress,
        employerName: this.employmentForm.value.currentEmployerName,
        employerPhoneNumber: this.employmentForm.value.currentEmployerPhone,
      };

      this.pastEmployerInfo = pastEmployerInfo;
    }

    else {
      this.pastEmployerInfo = null;
    }
  }


  editPastEmploymentInfo = (pastEmployerInfodata: PastEmployerInfo) => {
    this.isEdit = true;

    this.pastEmployerInfo = pastEmployerInfodata;

    if (!pastEmployerInfodata.employerPhoneNumber) {
      this.pastEmployerInfo.employerPhoneNumber = null;
    }


  }

  loadPastemployment = () => {

    this.employmentInfo.pastEmploymentInformationList = this.employmentInfo.pastEmploymentInformationList.sort((a, b) => (a.employmentStartDate > b.employmentStartDate) ? -1 : 1);


    this.pastEmploymentList = [... this.employmentInfo.pastEmploymentInformationList];
    if (this.pastEmploymentList.length) {
      this.employmentForm.get('pastEmployerarr').setValue('yes');
    }
    else {
      this.employmentForm.get('pastEmployerarr').setValue('');
    }
    // console.log(this.pastEmploymentList);
  }

  public addressChange(address: any) {
    this.employmentForm.get('yourBusinessAddress').setValue(address.formatted_address);
  }

  public currentEmployerAddressChange(address: any) {
    this.employmentForm.get('currentEmployerAddress').setValue(address.formatted_address);
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


  // isFieldValid(form: FormGroup, field: string) {
  //   return !form.get(field).valid && form.get(field).touched;
  // }

  // isFieldTouched(form: FormGroup, field: string) {
  //   if (form.get(field).touched) {
  //     return this.isFieldValid(form, field);
  //   }
  // }


  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field)
    };
  }

  private employmentInfoObj = () => {
    const employmentInfo: EmploymentInfo = {
      currentEmployerAddress: this.employmentForm.get('currentEmployerAddress').value,
      currentEmployerIsHazardous: this.employmentForm.get('isHazardousNoise').value,
      currentEmployerName: this.employmentForm.get('currentEmployerName').value,
      currentEmployerPhoneNumber: this.employmentForm.get('currentEmployerPhone').value,
      currentSituation: this.employmentForm.get('currentSituation').value,
      currentlyEmployed: this.employmentForm.get('isEmployed').value,
      hasEverBeenSelfEmployed: this.employmentForm.get('wasSelfEmployed').value,
      hasRetired: this.employmentForm.get('isRetired').value,
      hasUsedNoisyEquipmentOutOfWork: this.employmentForm.get('noisyMachineryOffwork').value,
      noisyEquipmentDetails: this.employmentForm.get('noisyMachineryDescription').value,
      retirementDate: this.employmentForm.get('retirementDate').value ? _moment(this.employmentForm.get('retirementDate').value).format('YYYY-MM-DD') : null,
      selfEmpBusinessAddress: this.employmentForm.get('yourBusinessAddress').value,
      selfEmpBusinessName: this.employmentForm.get('yourBusinessName').value,
      selfEmpEndDate: this.employmentForm.get('yourBusinessTo').value ? _moment(this.employmentForm.get('yourBusinessTo').value).format('YYYY-MM-DD') : null,
      selfEmpHasInsurance: this.employmentForm.get('hasInsurance').value,
      selfEmpStartDate: this.employmentForm.get('yourBusinessFrom').value ? _moment(this.employmentForm.get('yourBusinessFrom').value).format('YYYY-MM-DD') : null,
    };
    return employmentInfo;
  }

  private handlePastEmploymentInfo = (pastEmploymentInfo: PastEmployerInfoDTO) => {

    if (pastEmploymentInfo) {
      const token = sessionStorage.getItem('access_token');
      if (!this.isEdit) {
        this.pastEmploymentService.addPastEmploymentInfo(this.claimId, pastEmploymentInfo, token).subscribe(
          (res: Claim) => {
            this.isPastEmploye = true;
            sessionStorage.setItem('claim', JSON.stringify(res));
            this.employmentInfo.pastEmploymentInformationList = res.employmentInformation.pastEmploymentInformationList.sort((a, b) => (a.employmentStartDate > b.employmentStartDate) ? -1 : 1);
            this.pastEmploymentList = [... this.employmentInfo.pastEmploymentInformationList];
            this.mapEmployerData();
            if (this.pastEmploymentList && this.pastEmploymentList.length == 1) {
              sessionStorage.setItem('firstPastEmploymentInfoId', (this.pastEmploymentList[0].pastEmploymentInfoId).toString());
            }
          },
          error => {
            this.iscommonerrormsg = true;
            document.getElementById('commonerrormsgid').focus();
          }
        );
      } else {

        this.pastEmploymentService.updatePastEmploymentInfo(this.claimId, this.pastEmployerInfo.pastEmploymentInfoId, pastEmploymentInfo, token).subscribe(
          (res: Claim) => {
            sessionStorage.setItem('claim', JSON.stringify(res));
            this.employmentInfo.pastEmploymentInformationList = res.employmentInformation.pastEmploymentInformationList.sort((a, b) => (a.employmentStartDate > b.employmentStartDate) ? -1 : 1);
            this.pastEmploymentList = [... this.employmentInfo.pastEmploymentInformationList];
            this.mapEmployerData();
          },
          error => {
            this.iscommonerrormsg = true;
            document.getElementById('commonerrormsgid').focus();
          }
        );

      }



    }
  }

  trimpaces(formControl: string) {
    const value = this.employmentForm.get(formControl).value;
    if (value) {
      this.employmentForm.get(formControl).setValue(value.trim());
    }
  }

  // private getAllTools = () => {

  //   if (this.predefinedToolList.length <= 0) {
  //     this.pastEmploymentService.getAllTools().subscribe(
  //       res => {
  //         this.predefinedToolList = res;
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     )
  //   }
  // }

  getAllTools = () => {
    const engTools: string[] = [];
    const frcTools: string[] = [];

    const token = sessionStorage.getItem('access_token');
    this.pastEmploymentService.getAllTools(token).subscribe(
      res => {

        if (sessionStorage.getItem('currentLang') === 'en') {
          for (const enlng of res) {
            engTools.push(enlng.toolEnName);
          }
          this.predefinedToolList = engTools;
          // console.log('English toolList', this.predefinedToolList)
        } else {
          for (const frlng of res) {
            frcTools.push(frlng.toolFrName);
          }
          this.predefinedToolList = frcTools;
          // console.log('toolList in french', this.predefinedToolList);
        }
        this.pastEmployment.getToolFiltered();
      },
      error => {
        this.iscommonerrormsg = true;
        document.getElementById('commonerrormsgid').focus();
      }
    );
    // }
  }

  checkPhone(event) {
    if (event.keyCode > 47 && event.keyCode < 58) {
      return;
    } else {
      this.employmentForm.get('currentEmployerPhone').setValue(event.target.value.replace(/[^0-9-+() ]*/g, ''));
    }
  }

  checkDate(value, item?) {
    this.dateCheck = true;
    this.validateFutureDate2(value);
    if (item === 'retirementDate') {
      this.datevalue1 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.employmentForm.get('retirementDate').setValue('');
        }
      }

      this.validretirementDate = this.IsValidDate(value);
    }
    if (item === 'yourBusinessFrom') {
      this.datevalue2 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.employmentForm.get('yourBusinessFrom').setValue('');
        }
      }

      this.validyourBusinessFrom = this.IsValidDate(value);
    }
    if (item === 'yourBusinessTo') {
      this.datevalue3 = value.length;

      if (value.length === 3) {
        const character3 = value.charAt(2);
        const isnum3 = /^\d+$/.test(character3);
        if (isnum3) {
          this.employmentForm.get('yourBusinessTo').setValue('');
        }
      }

      this.validyourBusinessTo = this.IsValidDate(value);
    }
    // if (item == 'dateOfFirstAudiogram') {
    //   this.validdateOfFirstAudiogram = this.IsValidDate(value);
    // }
    // if (item == 'entAppointmentDate') {
    //   this.validentAppointmentDate = this.IsValidDate(value);
    // }
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
