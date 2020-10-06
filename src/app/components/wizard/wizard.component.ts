import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, AfterViewChecked, Input } from '@angular/core';
import { Claim } from 'src/app/models/claim';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyInformationComponent } from './my-information/my-information.component';
import { HealthCareComponent } from './health-care/health-care.component';
import { EmploymentComponent } from './employment/employment.component';
import { WizardSuccessComponent } from './wizard-success/wizard-success.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SupportingDocumentsComponent } from './supporting-documents/supporting-documents.component';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})

// Parent Componet of all components
export class WizardComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('myInformation', { static: false }) myInformation: MyInformationComponent;
  @ViewChild('healthCare', { static: false }) healthCare: HealthCareComponent;
  @ViewChild('employment', { static: false }) employment: EmploymentComponent;
  @ViewChild('supportingDocuments', { static: false }) supportingDocuments: SupportingDocumentsComponent;

  // public supportingDocuments;
  public review;
  public confirmation;
  public isLargeScreen: boolean = true;
  public claim: Claim;
  public myInfoForm: boolean;
  public healthCareForm: boolean;
  public employmentForm: boolean;
  public emitChanges: number = 0;
  public locale = null;
  public selectedIndex: number = 0;
  public alreadySaved = false;
  public feedbackurl = environment.feedbackurl;
  saveonExittoChild: any;
  saveonExitfromChild: any;
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private seoService: SeoService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getClaimInfo();
    this.getScreenSize();
  }
  ngAfterViewInit() {
    this.setInitialScreen();
    this.cdr.detectChanges();
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  getScreenSize = () => {
    const screenSize = window.innerWidth;
    // console.log(screenSize);
    if (screenSize < 1025) {
      this.isLargeScreen = false;
      // console.log('supposed to be false', this.isLargeScreen)
    } else {
      this.isLargeScreen = true;
      // console.log('supposed to be true', this.isLargeScreen)
    }
  }
  onTabClick = () => {
    sessionStorage.setItem('component', this.stepper.selectedIndex.toString());
    switch (this.stepper.selectedIndex) {
      case 0:
        this.translate.get('wizard').subscribe(data => {
          this.seoService.updateTitle(data.myInformation + ' | WSIB Online services');
        });
        break;
      case 1 || '1':
        this.translate.get('wizard').subscribe(data => {
          this.seoService.updateTitle(data.healthCare + ' | WSIB Online services');
        });
        break;
      case 2 || '2':
        this.translate.get('wizard').subscribe(data => {
          this.seoService.updateTitle(data.employment + ' | WSIB Online services');
        });
        break;
      case 3 || '3':
        this.translate.get('wizard').subscribe(data => {
          this.seoService.updateTitle(data.supportingDocuments + ' | WSIB Online services');
        });
        break;
      case 4 || '4':
        this.translate.get('wizard').subscribe(data => {
          this.seoService.updateTitle(data.review + ' | WSIB Online services');
        });
        break;
      case 5 || '5':
        this.translate.get('wizard').subscribe(data => {
          this.seoService.updateTitle(data.confirmation + ' | WSIB Online services');
        });
        break;
      default:
        break;
    }

    if (this.stepper.selectedIndex === 4) {
      this.emitChanges = this.emitChanges + 1;
    }
    // console.log('this.stepper.selectedIndex', this.stepper.selectedIndex);
  }
  saveOnTabClick = (event) => {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      this.selectedIndex = event.selectedIndex;
      // console.log('saveOnTabClick selectedIndex', this.stepper.selectedIndex);
      if (this.stepper.selectedIndex === 0) {
        this.myInformation.addOrUpdatePersonalInfo(false, this.alreadySaved, false);
      }
      if (this.stepper.selectedIndex === 1) {
        this.healthCare.addOrUpdateHealthCareProviderInfo(false, this.alreadySaved, false);
      }
      if (this.stepper.selectedIndex === 2) {
        this.employment.addOrUpdateEmploymentInfo(false, this.alreadySaved);
      }
      this.alreadySaved = false;

    }

  }
  /*
  * @author Deivid Mafra;
  * @date 08/13/2020;
  * @remarks Method responsible for retrieving the claim information from local storage.
  */
  getClaimInfo = () => {
    if (sessionStorage.getItem('claim')) {
      this.claim = new Claim();
      this.claim = JSON.parse(sessionStorage.getItem('claim'));
    } else {
      this.claim = new Claim();
      this.claim.claimId = Number(sessionStorage.getItem('claimId'));
      this.claim.referenceNumber = sessionStorage.getItem('referenceNumber');
    }
  }
  checkMyInformationComplete = (myInfoFormStatus: boolean) => {
    // console.log('status from myInfoFormStatus', myInfoFormStatus);
    this.myInfoForm = myInfoFormStatus;
  }
  checkHealthCareComplete = (healthFormStatus: boolean) => {
    // console.log('status from healthFormStatus', healthFormStatus);
    this.healthCareForm = healthFormStatus;
  }
  checkEmploymentComplete = (employFormStatus: boolean) => {
    // console.log('status from employFormStatus', status);
    this.employmentForm = employFormStatus;
  }
  setInitialScreen = () => {
    if (!this.myInfoForm) {
      this.stepper.selectedIndex = 0;
      return;
    }
    if (!this.healthCareForm) {
      this.stepper.selectedIndex = 1;
      // console.log('this.healthCareForm', this.healthCareForm)
      return;
    }
    if (!this.employmentForm) {
      this.stepper.selectedIndex = 2;
      return;
    } else {
      this.stepper.selectedIndex = 4;
    }

  }
  employmentSaved = (isSaved: boolean) => {
    if (isSaved) {
      this.getClaimInfo();
    }
  }
  localeChanged(locale: string) {
    this.locale = locale;
  }
  next = () => {
    this.alreadySaved = true;
    this.stepper.next();

  }
  previous = () => {
    this.alreadySaved = true;
    this.stepper.previous();
  }
  get editable(): boolean {
    return !!sessionStorage.getItem('claim');
  }

  setTabindex = (event) => {
    // if(event === 5)
    this.stepper.selected.completed = true;
    this.selectedIndex = event;
  }
  showSuccess = (isSave) => {
    let dialogRef;
    window.scrollTo({
      left: 0, top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      dialogRef = this.dialog.open(WizardSuccessComponent, {
        width: '30%',
        data: isSave,
        disableClose: true,
      });
    }, 0);

    if (!isSave) {
      setTimeout(() => {
        dialogRef.close();
      }, 2000);
    }
  }


  saveDataonExit(event) {
    this.saveonExittoChild = undefined;
    setTimeout(() => {
      this.saveonExittoChild = event;
    }, 100);
  }

  saveDataonExit1(event) {
    // this.saveonExitfromChild = undefined;
    setTimeout(() => {
      this.saveonExitfromChild = event;
    }, 100);
  }
}
