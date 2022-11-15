import { Injectable } from '@angular/core';
import { Observable} from "rxjs";
import { Location} from "@app/manager/types/interfaces";
import {ApiService} from "@app/core/services/api.service";
import {UserService} from "@app/shared/services/user.service";
import {User} from "@app/auth/types/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ManagersService {

  private readonly LOCATION_PATH: string = '/location';

  constructor(private apiService: ApiService) {
  }

  saveLocation(location: Location): Observable<any> {
    return this.apiService.post(this.LOCATION_PATH, location);
  }

  getLocations(): Observable<Location[]> {
    return this.apiService.get(`${this.LOCATION_PATH}/all`);
  }

  editUser(updatedUser: User): Observable<User> {
    return this.apiService.post('/admin/user', updatedUser);
  }

  getAllUsers(): Observable<User[]> {
    return this.apiService.get('/admin/users');
  }

  deleteUser(userId: any): Observable<void> {
    return this.apiService.delete(`/admin/user/${userId}`);
  }
}
