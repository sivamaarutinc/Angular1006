import { Directive, HostListener, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[focusInvalidInput]'
})

// for check forms valid fields on submit (middleware)
export class FormDirective {

  constructor(private el: ElementRef) { }

  @HostListener('submit')

  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    if (invalidControl) {
      invalidControl.focus();
      invalidControl?.querySelector('.ng-dirty')?.focus();
    }
  }
}
