import type { Device, CreateDeviceDto, UpdateDeviceDto } from "../types/device.types";
import { apiRequest } from "../../../api/apiClient";

export async function getDevices(): Promise<Device[]> {
  return apiRequest<Device[]>("/api/devices");
}

export async function getDeviceById(deviceId: string): Promise<Device> {
  return apiRequest<Device>(`/api/devices/${deviceId}`);
}

export async function createDevice(data: CreateDeviceDto): Promise<Device> {
  return apiRequest<Device>("/api/devices/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDevice(
  deviceId: string,
  data: UpdateDeviceDto
): Promise<Device> {
  return apiRequest<Device>(`/api/devices/${deviceId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDevice(deviceId: string): Promise<void> {
  return apiRequest<void>(`/api/devices/${deviceId}`, {
    method: "DELETE",
  });
}
