import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "@app/auth/services";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthService) {
  }

  canActivate() {

    if (!this.authenticationService.isUser()) {
      this.router.navigate(['']);
    }

    return true;
  }

}
