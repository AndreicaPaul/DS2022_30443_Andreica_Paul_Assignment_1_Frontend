import { Injectable } from '@angular/core';
import { Observable} from "rxjs";
import { Location} from "@app/manager/types/interfaces";
import {ApiService} from "@app/core/services/api.service";
import {UserService} from "@app/shared/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class ManagersService {

  private readonly LOCATION_PATH: string = '/location';

  constructor(private apiService: ApiService, private userService: UserService) {
  }

  saveLocation(location: Location): Observable<any> {
    return this.apiService.post(this.LOCATION_PATH, location);
  }

  getLocations(): Observable<Location[]> {
    return this.apiService.get(`${this.LOCATION_PATH}/all`);
  }
}
