import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.css']
})

// This class is responsible for the Globally error handle (display error/validation message)
export class FieldErrorDisplayComponent {

  constructor() { }

  @Input() errorMsg: string;
  @Input() displayError: boolean;

}
