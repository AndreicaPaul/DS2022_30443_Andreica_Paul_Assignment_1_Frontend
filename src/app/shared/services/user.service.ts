import {Injectable} from "@angular/core";
import {ApiService} from "@app/core/services/api.service";
import {AuthService} from "@app/auth/services";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "@app/auth/types/interfaces";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_PATH: string = '/user';
  private currentUser = new BehaviorSubject<User>(null);

  constructor(private apiService: ApiService, private authService: AuthService) {
  }

  setUser(): Observable<User> {
    return this.apiService.post(this.USER_PATH, null,{token: this.authService.getToken()})
      .pipe(tap((user: User) => {
        this.currentUser.next(user);
        return user;
      }));
  }

  get user() {
    return this.currentUser.value;
  }

  sendEmail() {
    return this.apiService.get(`${this.USER_PATH}/mail`);
  }
}
