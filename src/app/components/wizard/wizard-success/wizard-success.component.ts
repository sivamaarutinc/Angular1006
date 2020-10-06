import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wizard-success',
  templateUrl: './wizard-success.component.html',
  styleUrls: ['./wizard-success.component.css']
})

/* This class is responsible for Globally use Save and submission popup message */
export class WizardSuccessComponent {
  constructor(
    public dialogRef: MatDialogRef<WizardSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean
  ) { }

  clkok(): void {
    this.dialogRef.close();
  }


}
