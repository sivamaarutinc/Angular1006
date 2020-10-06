import { Component, OnInit } from '@angular/core';
import { Claim } from 'src/app/models/claim';
import * as _moment from 'moment';
@Component({
  selector: 'app-printer-header',
  templateUrl: './printer-header.component.html',
  styleUrls: ['./printer-header.component.css']
})
// This class is responsible for printing header on Print page.
export class PrinterHeaderComponent implements OnInit {

  submitionDate: any;
  submitionTime: any;
  month: any;

  constructor() {
    const claim: Claim = localStorage.getItem('claimPrint') ? JSON.parse(localStorage.getItem('claimPrint')) : {};
    if (claim.submitionDate && sessionStorage.getItem('currentLang') == 'en') {
      this.submitionDate = _moment(claim.submitionDate).format('DD MMM YYYY');
      this.submitionTime = _moment(claim.submitionDate).format('hh:mm a');
    }
    else if (claim.submitionDate && sessionStorage.getItem('currentLang') == 'fr') {
      const newDate = _moment(claim.submitionDate).format('DD MMM YYYY').split(' ');
      switch (newDate[1]) {
        case 'Feb': this.month = 'FÉV'; break;
        case 'Apr': this.month = 'AVR'; break;
        case 'May': this.month = 'MAI'; break;
        case 'Aug': this.month = 'AOÛ'; break;
        case 'Dec': this.month = 'DÉC'; break;
        default:
          this.month = newDate[1];
          break;
      }
      
      this.submitionDate = newDate[0] + ' ' + this.month.toUpperCase() + ' ' + newDate[2];
      this.submitionTime = _moment(claim.submitionDate).format('HH') + ' h ' + _moment(claim.submitionDate).format('mm');
    }
  }

  ngOnInit(): void {
  }

}
