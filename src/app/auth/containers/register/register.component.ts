import {finalize, first} from 'rxjs';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '@app/auth/services';
import {RegisterRequest} from "@app/auth/types/interfaces";
import {UserType} from "@app/auth/types/enums/user-type.enum";

@Component({
  selector: 'app-register',
  template: `
    <app-register-form
      [errorMessage]="errorMessage"
      [loading]="loading"
      (register)="onRegister($event)"
    ></app-register-form>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(user: RegisterRequest) {
    this.loading = true;
    this.errorMessage = '';

    this.authService
      .registration(user)
      .pipe(
        first(),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          if(user.userRole === UserType.ADMIN) {
            this.router.navigate(['manager/home']);
          } else {
            this.router.navigate(['user/home']);
          }
        },
        error: (error:HttpErrorResponse) =>
          (this.errorMessage = error.error?.message)
      });

  }
}
