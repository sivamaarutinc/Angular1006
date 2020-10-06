import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDropFile]'
})

//  This class is responsible for for drag and drop functionality
export class DragDropFileDirective {

  constructor() { }

  @Output() filedropped: EventEmitter<string> = new EventEmitter();

  @HostBinding('style.opacity') private opacity = '1';


  /* Dragover listener */
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '0.8';
  }
  /* Dragleave listener */
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
  }
  /* Drop listener */
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.filedropped.emit(files);
    }
  }


}
