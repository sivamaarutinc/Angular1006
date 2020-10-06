import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

// This class is responsible for Footer of the website (including all footer links)
export class FooterComponent implements OnInit {
  public getyear = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}
