import { Pipe, PipeTransform } from '@angular/core';
import { translations } from '@app/shared/translations/translations';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  transform(key: string, params?: Record<string, any>): string {
    if (!key) {
      return '';
    }

    let message: string;

    try {
      message =
        key.split('.').reduce((acc: any, curr: string) => {
          if (typeof acc[curr] === 'function') {
            return acc[curr](params);
          }
          return acc[curr];
        }, translations) || key;
    } catch (e) {
      message = key;
    }

    return message;
  }
}
