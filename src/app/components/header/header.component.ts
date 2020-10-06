import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

// This class is responsible for Header of website (user can exit from website and Change language of whole website)
export class HeaderComponent implements OnInit {

  isEnglish: boolean = true;
  isFrench: boolean;
  saveonExitfromChild1value: any = false;

  exitLink: string = 'https://wsib.ca/en/onlineservices';

  @Output() localeChanged: EventEmitter<string> = new EventEmitter();

  // @Output() showSuccess: EventEmitter<boolean> = new EventEmitter();
  @Output() saveOnExit: EventEmitter<boolean> = new EventEmitter();

  @Output() saveDataonExit: EventEmitter<any> = new EventEmitter();

  @Input() set saveonExitfromChild1(value: string) {
    this.saveonExitfromChild1value = value;
    if (value) {
      this.navigateNewtoURIDefault();
    }
  }

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) {
    const languageName = this.router.url;
    const language = languageName.split('/');

    if (language[1] === 'en') {
      sessionStorage.setItem('currentLang', 'en');
    }
    if (language[1] === 'fr') {
      sessionStorage.setItem('currentLang', 'fr');
    }
  }

  ngOnInit() {
    if (sessionStorage.getItem('currentLang')) {
      this.switchLanguage(sessionStorage.getItem('currentLang'));
    }
  }

  switchLanguage(lang: string) {
    this.isEnglish = lang.includes('en');
    this.isFrench = lang.includes('fr');
    this.translateService.use(lang);
    if (this.isFrench) {
      this.exitLink = 'https://www.wsib.ca/fr/servicesenligne';
    } else {
      this.exitLink = 'https://www.wsib.ca/en/onlineservices';
    }
    sessionStorage.setItem('currentLang', lang);
    this.localeChanged.emit(lang);
  }

  navigateNewtoURI() {
    // console.log('exit');
    this.saveDataonExit.emit();

    // sessionStorage.clear();
    // sessionStorage.clear();
    this.saveOnExit.emit();


    // window.location.href = this.exitLink;
    if (!this.saveonExitfromChild1value) {
      setTimeout(() => {
        this.navigateNewtoURIDefault();
      }, 1000);
    }


  }

  navigateNewtoURIDefault() {

    sessionStorage.clear();
    this.saveOnExit.emit();

    window.location.href = this.exitLink;

  }

  exit = (isSave: boolean) => {

    this.saveOnExit.emit();
    // this.showSuccess.emit(isSave);
  }
}
