import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skip-to-main',
  templateUrl: './skip-to-main.component.html',
  styleUrls: ['./skip-to-main.component.css']
})
export class SkipToMainComponent implements OnInit {
  skipLinkPath: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.skipLinkPath = `${this.router.url}#main-content`;
  }

}
