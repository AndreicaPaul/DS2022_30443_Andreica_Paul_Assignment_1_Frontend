import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserType} from "@app/auth/types/enums/user-type.enum";
import {Gender} from "@app/auth/types/enums";
import {passwordMatchValidator} from "@app/auth/validators";
import {first} from "rxjs";
import {RegisterRequest} from "@app/auth/types/interfaces";

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {
  form: FormGroup;
  currentErrorMessage: string | null;
  @Output() register = new EventEmitter<RegisterRequest>();

  constructor(private formBuilder: FormBuilder) { }

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

  ngOnInit(): void {
    this.initForm();
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
