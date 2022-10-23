import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  template: `
    <mat-form-field class="width-full" [appearance]="'outline'" color="primary">
      <mat-label>{{ label | translate }}</mat-label>
      <textarea
        matInput
        [placeholder]="placeholder"
        [formControl]="control"
        [required]="label && isRequired"
      ></textarea>
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
    </mat-form-field>
  `,
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() error: string;

  get isRequired(): boolean {
    if (this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return false;
  }

  displayError(error: any): boolean {
    return !(error === 'required');
  }
}
