import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      mat-flat-button
      [color]="color"
      [disabled]="loading || disabled"
      [ngClass]="{ 'transparent-color': loading }"
      (click)="onClick()"
    >
      {{ label | translate }}
      <ng-container *ngIf="loading">
        <mat-spinner [diameter]="24" class="disabled"></mat-spinner>
      </ng-container>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() color: ThemePalette = 'primary';
  @Input() label: string;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Output() press = new EventEmitter<void>();

  onClick(): void {
    this.press.emit();
  }
}
