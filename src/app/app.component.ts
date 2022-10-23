import { Component } from '@angular/core';
import { IconRegistryService } from '@app/core/services';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private iconRegistryService: IconRegistryService) {
    this.iconRegistryService.addSvgIcons();
  }
}
