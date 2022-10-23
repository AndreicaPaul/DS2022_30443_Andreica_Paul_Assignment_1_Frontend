import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {LoginRequest} from "@app/auth/types/interfaces";
import {UserType} from "@app/auth/types/enums/user-type.enum";

@Component({
  selector: 'app-login-form',
  template: `
    <form
      [formGroup]="form"
      fxLayout="column"
      fxLayoutAlign="space-between center"
      class="width-full height-full"
    >
      <div fxLayout="column" class="width-full margin-bottom-xl">
        <span
          class="width-full accent-color margin-bottom-m"
          [ngClass.lt-md]="'mat-display-3'"
          [ngClass.gt-sm]="'mat-display-3'"
        >
          {{ 'auth.login.title' | translate }}
        </span>
        <span
          class="width-full margin-bottom-m"
          [ngClass.lt-md]="'mat-title'"
          [ngClass.gt-sm]="'mat-display-1'"
        >
          {{ 'auth.login.welcomeBack' | translate }}
        </span>

        <app-input
          [label]="'Username'"
          [control]="emailControl"
        ></app-input>
        <app-input
          [label]="'labels.password' | translate"
          [control]="passwordControl"
          [type]="'password'"
        ></app-input>
      </div>

      <div fxLayout="column" fxLayoutAlign="center center">
        <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="20">
          <app-button
            [label]="'Login as a User'"
            [loading]="loading"
            (press)="onLoginUser()"
          ></app-button>
          <app-button
            [label]="'Login as a Manager'"
            [loading]="loading"
            (press)="onLoginManager()"
          ></app-button>
        </div>
        <mat-error class="margin-top-l in-place-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </mat-error>
      </div>
    </form>
  `,
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Input() errorMessage: string = null;
  @Input() loading: boolean;
  @Output() login = new EventEmitter<LoginRequest>();

  form: FormGroup;

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

  onLoginUser(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.login.emit({
      username: this.emailControl.value,
      password: this.passwordControl.value,
      userRole: UserType.USER
    });
  }

  onLoginManager(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.login.emit({
      username: this.emailControl.value,
      password: this.passwordControl.value,
      userRole: UserType.ADMIN
    });
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
