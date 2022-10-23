import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LoginRequest, RegisterRequest } from "@app/auth/types/interfaces";
import {ApiService} from "@app/core/services/api.service";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {UserType} from "@app/auth/types/enums/user-type.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_PATH: string = '/login';
  private readonly REGISTRATION_PATH: string = '/register';

  constructor(private apiService: ApiService, private router: Router) {
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    if(sessionStorage.getItem('role')) {
      return sessionStorage.getItem('role') === UserType.ADMIN
    }
    return true;
  }

  isUser(): boolean {
    if(sessionStorage.getItem('role')) {
      return sessionStorage.getItem('role') === UserType.USER
    }
    return true;
  }

  getToken(): string {
    return sessionStorage.getItem('token');
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.apiService.post(this.LOGIN_PATH, loginRequest).pipe(tap((resp) => {
      sessionStorage.setItem('token', resp.token);
      sessionStorage.setItem('role', loginRequest.userRole)
    }));
  }

  registration(registrationRequest: RegisterRequest) {
    return this.apiService.post(this.REGISTRATION_PATH, registrationRequest).pipe(switchMap(() => {

      const loginRequest = {} as LoginRequest;
      loginRequest.username = registrationRequest.username;
      loginRequest.password = registrationRequest.password;
      loginRequest.userRole = registrationRequest.userRole;
      return this.login(loginRequest);
    }));
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    this.router.navigate(['']);
  }

}
