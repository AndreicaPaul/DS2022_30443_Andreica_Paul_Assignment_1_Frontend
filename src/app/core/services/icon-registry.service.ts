import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconRegistryService {
  private readonly folder = 'assets/icons';

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  addSvgIcons(): void {
    const iconDefinitions: any = {
      // Define custom icons here following the template below
      close: this.iconPath('close'),
      eye: this.iconPath('eye'),
      eye_off: this.iconPath('eye-off'),
      logo_icon: this.iconPath('logo-icon'),
      search: this.iconPath('search'),
      plus: this.iconPath('plus'),
    };

    Object.keys(iconDefinitions).forEach(key => {
      this.iconRegistry.addSvgIcon(
        key,
        this.sanitizer.bypassSecurityTrustResourceUrl(iconDefinitions[key])
      );
    });
  }

  private iconPath(icon: string): string {
    return `${this.folder}/${icon}.svg`;
  }
}
