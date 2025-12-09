export interface Device {
  id: string;
  name: string;
  hostname: string;
  location: string;
  firmware_version: string;
  is_online: boolean;
  last_seen: string;
  registered_at: string;
}

export interface CreateDeviceDto {
  name: string;
  hostname: string;
  location: string;
  firmware_version: string;
}

export interface UpdateDeviceDto {
  name?: string;
  hostname?: string;
  location?: string;
  firmware_version?: string;
}
