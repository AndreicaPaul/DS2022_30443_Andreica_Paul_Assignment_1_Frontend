export interface SaveDevicePayload {
  id: number;
  name: string;
  description: string;
  maximumHourlyConsumption: number;
  location?: number;
  user?: number;
}
