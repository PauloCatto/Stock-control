import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
  transform(value: string | null, args: number): any {
    if (value == null) {
      return '';
    }
    return value.length > args ? value.substring(0, args) + '...' : value;
  }
}
