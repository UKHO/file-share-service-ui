import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, propName: string, propValue: string): any {
    if (value.length === 0) {
      return value;
    }
    const result = [];
    for (const item of value) {
      if (item[propName] === propValue) {
        result.push(item);
      }
    }
    return result;
  }
}