import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlexDirection } from '@app/shared/types/enums';

@Component({
  selector: 'app-radio-group',
  template: `
    <mat-label
      class="mat-body-1 margin-bottom-m"
      [ngClass]="{
        'dark-gray-color': control.disabled,
        'warn-color': control.touched && control.invalid
      }"
    >
      {{ label | translate }}
    </mat-label>

    <mat-radio-group [formControl]="control" [fxLayout]="direction">
      <mat-radio-button
        *ngFor="let option of options; let last = last"
        color="primary"
        [ngClass]="{ 'padding-bottom-m': direction === 'column' && !last }"
        [value]="valueFn(option)"
      >
        {{ translate ? (displayFn(option) | translate) : displayFn(option) }}
      </mat-radio-button>

      <mat-error
        *ngIf="control.touched && control?.hasError('required')"
        class="padding-horizontal-xs"
      >
        {{ 'errors.required' | translate }}
      </mat-error>
    </mat-radio-group>
  `,
  styleUrls: ['./radio-group.component.scss']
})
export class RadioGroupComponent<T> {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() options: T[];
  @Input() direction: FlexDirection = FlexDirection.ROW;
  @Input() translate: boolean = true;
  @Input() valueFn: (option: T) => any = (option: T) => option;
  @Input() displayFn: (option: T) => any = (option: T) => option;
}
