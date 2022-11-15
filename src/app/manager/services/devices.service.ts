import {Injectable} from "@angular/core";
import {ApiService} from "@app/core/services/api.service";
import {SaveDevicePayload} from "@app/manager/types/interfaces";
import {Observable} from "rxjs";
import {Device} from "@app/manager/types/interfaces/device.interface";

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private readonly DEVICES_PATH: string = '/admin';

  constructor(private apiService: ApiService) {
  }

  addDevice(updatedDevice: SaveDevicePayload): Observable<Device> {
    return this.apiService.post(`${this.DEVICES_PATH}/device`, updatedDevice);
  }

  editDevice(device: Device): Observable<Device>{
    return this.apiService.post(`${this.DEVICES_PATH}/device/${device.id}`, device);
  }

  deleteDevice(deviceId: number): Observable<void> {
    return this.apiService.delete(`${this.DEVICES_PATH}/device/${deviceId}`);
  }

  getAllDevices(): Observable<Device[]> {
    return this.apiService.post(`${this.DEVICES_PATH}/devices`, sessionStorage.getItem('token'));
  }
}
