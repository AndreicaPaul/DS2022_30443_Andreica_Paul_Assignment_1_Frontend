import { finalize, first } from 'rxjs';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from "@app/auth/services";
import {LoginRequest} from "@app/auth/types/interfaces";
import {UserType} from "@app/auth/types/enums/user-type.enum";

@Component({
  selector: 'app-login',
  template: `
    <app-login-form
      [errorMessage]="errorMessage"
      [loading]="loading"
      (login)="onLogin($event)"
    ></app-login-form>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLogin(loginRequest: LoginRequest): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login(loginRequest)
      .pipe(
        first(),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          if (loginRequest.userRole === UserType.ADMIN) {
            this.router.navigate(['manager/home']);
          } else {
            this.router.navigate(['user/home']);
          }
        },
        error: (error:HttpErrorResponse) =>
          (this.errorMessage = error.error?.message)
      });
  }

  onResetPassword(path: string): void {
    this.router.navigate([path]);
  }
}
