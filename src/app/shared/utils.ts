import { FormControl } from '@angular/forms';

export const isApiRequest = (url: string): boolean => {
  return !/^https?:\/\/(.*)/.test(url) && !/^assets\/(.*)/.test(url);
};

export class MaskUtils {
  static integerMask(
    control?: FormControl,
    numberDigits?: number
  ): (string | RegExp)[] {
    const value = control?.value;

    if (!value) {
      return [/[1-9]/];
    }

    const length = numberDigits
      ? Math.min(value.toString().length + 1, numberDigits)
      : value.toString().length + 1;

    return Array(length).fill(/[0-9]/);
  }

  static floatMask(control?: FormControl): (string | RegExp)[] {
    const value = control?.value;
    if (!value) {
      return [/[1-9]/];
    }

    const decimalPoint = value.toString().search(/[.,]/);
    const mask =
      decimalPoint !== -1
        ? Array(decimalPoint + 1).fill(/[0-9.,]/)
        : Array(value.toString().length + 1).fill(/[0-9.,]/);

    return decimalPoint !== -1 ? [...mask, /[0-9]/, /[0-9]/] : mask;
  }
}

export const getFileUrl = (buffer: ArrayBuffer, type: string): string => {
  const blob = new Blob([buffer], { type });
  return window.URL.createObjectURL(blob);
};
