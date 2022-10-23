import {Injectable} from "@angular/core";
import {ManagersService} from "@app/manager/services";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
   constructor(private managersService: ManagersService) {}

}
