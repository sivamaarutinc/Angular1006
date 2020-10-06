import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-out',
  templateUrl: './time-out.component.html',
  styleUrls: ['./time-out.component.css']
})
export class TimeOutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    sessionStorage.clear();
    localStorage.removeItem('claimPrint');
    localStorage.removeItem('claimDocumentsList');
    localStorage.removeItem('audiogramDocumentsList');
  }

}
