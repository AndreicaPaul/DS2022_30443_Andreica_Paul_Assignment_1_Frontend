import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials, RegisterUser } from '@app/auth/types/interfaces';
import { UserAccount } from '@app/auth/types/classes';

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {
  get url(): string {
    return 'auth';
  }

  constructor(private http: HttpClient) {}

  login(loginCredentials: Credentials): Observable<null> {
    return of(null);
  }

  logout(refreshToken: string): Observable<null> {
    return of(null);
  }

  refresh(refreshToken: string): Observable<null> {
    return of(null);
  }

  register(user: RegisterUser): Observable<RegisterUser> {
    return of(null);
  }

   getCurrentUser(): Observable<UserAccount> {
    return of(null);
  }

  getPrivateKey(): Observable<null> {
    return of(null);
  }
}
