import {first} from 'rxjs';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Gender, genderDisplay} from '@app/auth/types/enums';
import {RegisterRequest} from '@app/auth/types/interfaces';
import {passwordMatchValidator} from '@app/auth/validators';
import {UserType} from "@app/auth/types/enums/user-type.enum";

@Component({
  selector: 'app-register-form',
  template: `
    <form
      [formGroup]="form"
      fxLayout="column"
      fxLayoutAlign="space-between center"
      class="width-full height-full"
    >
      <div fxLayout="column" class="width-full margin-bottom-l">
        <span
          class="width-full accent-color margin-bottom-m"
          [ngClass.lt-md]="'mat-display-3'"
          [ngClass.gt-sm]="'mat-display-3'"
        >
          {{ 'auth.register.title' | translate }}
        </span>
        <span
          class="width-full margin-bottom-l"
          [ngClass.lt-md]="'mat-title'"
          [ngClass.gt-sm]="'mat-display-1'"
        >
          {{ 'auth.register.welcomeText' | translate }}
        </span>

        <app-input
          [label]="'labels.email' | translate"
          [control]="emailControl"
        ></app-input>
        <app-input
          [label]="'labels.password' | translate"
          [control]="passwordControl"
          [type]="'password'"
        ></app-input>
        <app-input
          [label]="'labels.confirmPassword' | translate"
          [control]="confirmPasswordControl"
          [type]="'password'"
        ></app-input>
        <app-input
          [label]="'Username'"
          [control]="usernameControl"
        ></app-input>
        <app-radio-group
          [label]="'labels.gender' | translate"
          [control]="genderControl"
          [options]="genderOptions"
          [displayFn]="genderDisplayFn"
          [translate]="true"
        ></app-radio-group>
      </div>

      <div fxLayout="column" fxLayoutAlign="center center">
        <div fxLayout="row" fxLayoutGap="20">
          <app-button
            [label]="'Register as a User'"
            [loading]="loading"
            (press)="onRegisterUser()"
          ></app-button>
          <app-button
            [label]="'Register as a Manager'"
            [loading]="loading"
            (press)="onRegisterManager()"
          ></app-button>
        </div>
        <mat-error class="margin-top-s in-place-error">
          {{ currentErrorMessage }}
        </mat-error>
      </div>
    </form>
  `,
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  @Input('errorMessage') set _errorMessage(errorMessage: string | null) {
    if (!!errorMessage) {
      this.errorMessage = errorMessage;
    }
  }

  @Input() loading: boolean;
  @Output() register = new EventEmitter<RegisterRequest>();

  form: FormGroup;
  currentErrorMessage: string | null;
  genderOptions: Gender[] = Object.values(Gender);
  genderDisplayFn = (gender: Gender): string => genderDisplay[gender];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  get usernameControl(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get genderControl(): FormControl {
    return this.form.get('gender') as FormControl;
  }

  onRegisterUser(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.register.emit({
      email: this.emailControl.value,
      password: this.passwordControl.value,
      username: this.usernameControl.value,
      userRole: UserType.USER
    });
  }

  onRegisterManager(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.register.emit({
      email: this.emailControl.value,
      password: this.passwordControl.value,
      username: this.usernameControl.value,
      userRole: UserType.ADMIN
    });
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]],
        username: [null, [Validators.required]],
        gender: [Gender.MALE, [Validators.required]]
      },
      { validator: passwordMatchValidator('confirmPassword', 'password') }
    );
  }

  private set errorMessage(errorMessage: string) {
    this.currentErrorMessage = errorMessage;
    this.form.valueChanges
      .pipe(first())
      .subscribe(() => (this.currentErrorMessage = null));
  }
}
