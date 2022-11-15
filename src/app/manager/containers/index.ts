import {ManagerHomeComponent} from "./manager-home/manager-home.component";
import {DeviceListComponent} from "@app/manager/containers/device-list/device-list.component";
import {UserListComponent} from "@app/manager/containers/user-list/user-list.component";

export const containers = [ManagerHomeComponent, DeviceListComponent, UserListComponent];

export * from './manager-home/manager-home.component';
export * from './device-list/device-list.component';
export * from './user-list/user-list.component';

