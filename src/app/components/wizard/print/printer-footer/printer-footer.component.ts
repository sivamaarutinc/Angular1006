import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-printer-footer',
  templateUrl: './printer-footer.component.html',
  styleUrls: ['./printer-footer.component.css']
})

// This class is responsible for Display page number and address details in footer
export class PrinterFooterComponent implements OnInit {

  @Input() pageNumber: string;
  constructor() { }

  ngOnInit(): void {
  }

}
