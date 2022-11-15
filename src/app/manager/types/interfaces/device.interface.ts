import {User} from "@app/auth/types/interfaces";
import {Location} from "@app/manager/types/interfaces/location.interface";

export interface Device {
  id: number;
  name: string;
  description: string;
  maximumHourlyConsumption: number;
  location?: Location;
  user?: User;
}
