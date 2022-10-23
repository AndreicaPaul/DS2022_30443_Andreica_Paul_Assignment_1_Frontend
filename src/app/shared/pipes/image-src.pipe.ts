import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'imageSrc'
})
export class ImageSrcPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(file: Blob | string): SafeUrl {
    if (file instanceof Blob) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    return this.sanitizer.bypassSecurityTrustUrl(file);
  }
}
