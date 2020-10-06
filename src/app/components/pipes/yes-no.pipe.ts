import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo'
})

/* This class is responsible for Display Yes/No instead of true/false */
export class YesNoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? 'Yes' : 'No';
  }

}
