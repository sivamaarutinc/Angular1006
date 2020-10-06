import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  clonseLink: any;
  errorCode: any;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: boolean,
    private router: Router
  ) {
    this.getMessage();
  }

  clkok(): void {
    this.dialogRef.close();
    window.location.href = this.clonseLink;
  }
  getMessage() {
    this.errorCode = sessionStorage.getItem('apiErrorCode');
    if (!this.errorCode) {
      this.dialogRef.close();
      this.router.navigate(['en/nihl']);
      return;
    }
    switch (this.errorCode) {
      case 'NIHLA002':
        this.clonseLink = sessionStorage.getItem('apiUrl')+'/auth-resume';
        break;
      case 'NIHLA011':
      case 'NIHLA001':
      case 'NIHLA013':
        this.clonseLink = sessionStorage.getItem('apiUrl')+'/auth-newclaim';
        break;

      default:
        this.clonseLink = sessionStorage.getItem('apiUrl')+'/auth-newclaim';
        break;
    }
  }
}
