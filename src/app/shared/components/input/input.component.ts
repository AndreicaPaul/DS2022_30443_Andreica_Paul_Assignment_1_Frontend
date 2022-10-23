import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FloatLabelType,
  MatFormFieldAppearance
} from '@angular/material/form-field';
import { AbstractControl, FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MaskedInput } from '@app/shared/types/classes';

@Component({
  selector: 'app-input',
  template: `
    <mat-form-field
      [color]="color"
      class="width-full"
      [floatLabel]="floatLabel"
      [appearance]="appearance"
    >
      <mat-label>
        {{ label | translate }}
      </mat-label>
      <input
        matInput
        [textMask]="
          maskedInput ? { mask: mask, guide: false } : { mask: false }
        "
        [readonly]="readOnly"
        [placeholder]="placeholder | translate: placeholderData"
        [formControl]="control"
        [required]="label && isRequired"
        [type]="type === 'password' ? (hide ? 'password' : 'text') : type"
        [maxlength]="maxLength"
      />

      <div fxLayout="column" *ngIf="search" matPrefix>
        <mat-icon [svgIcon]="'search'" class="icon margin-right-s"></mat-icon>
      </div>

      <button
        *ngIf="type === 'password'"
        type="button"
        tabindex="-1"
        matSuffix
        mat-icon-button
        (click)="hide = !hide"
      >
        <mat-icon
          [ngClass]="
            control?.invalid && control?.touched ? 'icon__warn' : 'icon'
          "
          [svgIcon]="hide ? 'eye_off' : 'eye'"
          class="icon--password"
        >
        </mat-icon>
      </button>

      <button
        *ngIf="search && control?.value"
        type="button"
        tabindex="-1"
        mat-icon-button
        matSuffix
        [disabled]="!control?.value"
        (click)="onClearControl()"
      >
        <mat-icon [svgIcon]="'close_outline'" class="icon"></mat-icon>
      </button>

      <mat-error *ngIf="control?.hasError('required'); else customError">
        {{ 'errors.required' | translate }}
      </mat-error>

      <ng-template #customError>
        <mat-error *ngIf="error; else controlError">
          {{ error | translate }}
        </mat-error>

        <ng-template #controlError>
          <mat-error *ngFor="let error of control?.errors | keyvalue">
            <ng-container *ngIf="displayError(error.key)">
              {{ 'errors.' + error.key | translate: error.value }}
            </ng-container>
          </mat-error>
        </ng-template>
      </ng-template>

      <mat-hint
        *ngIf="maxLength && control"
        class="mat-caption grey-color"
        align="end"
        [ngClass]="{ 'warn-color': control.invalid }"
        >{{ control.value?.length || 0 }}/{{ maxLength }}</mat-hint
      >
    </mat-form-field>
  `,
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() label: string;
  @Input() placeholder: string;
  @Input() placeholderData: { [key: string]: string | number };
  @Input() error: string;
  @Input() control: FormControl;
  @Input() readOnly: boolean;
  @Input() floatLabel: FloatLabelType;
  @Input() search: boolean;
  @Input() maskedInput: MaskedInput;
  @Input() maxLength: number;

  @Output() clear = new EventEmitter<void>();

  hide: boolean = true;

  constructor() {}

  get isRequired(): boolean {
    if (this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return false;
  }

  get mask(): (RegExp | string)[] {
    return typeof this.maskedInput?.mask === 'function'
      ? this.maskedInput?.mask(this.control)
      : this.maskedInput?.mask;
  }

  displayError(error: any): boolean {
    return !(error === 'required');
  }

  onClearControl(): void {
    this.clear.emit();
  }
}
