import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(public dialog: MatDialog, private translateService: TranslateService) { }
  dialogRef = this.dialog.open(ModalComponent, {
    width: '30%',
    disableClose: true,
  });

  ngOnInit() {
    const lang = sessionStorage.getItem('currentLang');
    this.translateService.use(lang);
  }
}
