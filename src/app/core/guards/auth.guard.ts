import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "@app/auth/services";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthService, private router: Router) {
  }

  canActivate() {

    if (!this.authenticationService.isLoggedIn()) {
      this.router.navigate(['']);
    }

    return this.authenticationService.isLoggedIn();
  }

}
