import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabOptions } from '@app/shared/types/interfaces';

@Component({
  selector: 'app-toggle-tab',
  template: `
    <nav mat-tab-nav-bar>
      <a
        mat-tab-link
        *ngFor="let tabOption of tabOptions"
        fxFlex="55%"
        class="auth-switch__option--on padding-vertical-xs"
        [ngClass]="{
          'auth-switch__option--on': activePath === tabOption.path
        }"
        (click)="onSwitchOption(tabOption.path); $event.preventDefault()"
      >
        {{ tabOption.title }}
      </a>
    </nav>
  `,
  styleUrls: ['./toggle-tab.component.scss']
})
export class ToggleTabComponent {
  @Input() tabOptions: TabOptions[];
  @Input() activePath: string;
  @Output() switchTabEvent = new EventEmitter<string>();

  onSwitchOption(path: string): void {
    this.switchTabEvent.emit(path);
  }
}
