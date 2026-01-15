import type { Image, ImageMinimal, ImageUpdate, ImageListParams, ImageUploadParams } from "../types/image.types";
import { API_BASE_URL } from "../../../api/apiClient";

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export async function getImages(params?: ImageListParams): Promise<Image[]> {
  const token = getAuthToken();
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.dataset_id) queryParams.append("dataset_id", params.dataset_id);
    if (params.device_id) queryParams.append("device_id", params.device_id);
    if (params.uploaded_by) queryParams.append("uploaded_by", params.uploaded_by);
    if (params.analyzed !== undefined) queryParams.append("analyzed", String(params.analyzed));
    if (params.created_from) queryParams.append("created_from", params.created_from);
    if (params.created_to) queryParams.append("created_to", params.created_to);
    if (params.q) queryParams.append("q", params.q);
    if (params.page) queryParams.append("page", String(params.page));
    if (params.page_size) queryParams.append("page_size", String(params.page_size));
    if (params.order_by) queryParams.append("order_by", params.order_by);
  }

  const url = `${API_BASE_URL}/api/images/?${queryParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch images: ${res.statusText}`);
  }

  return res.json();
}

export async function getImage(imageId: string): Promise<Image> {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.statusText}`);
  }

  return res.json();
}

export async function uploadImage(params: ImageUploadParams): Promise<ImageMinimal> {
  const token = getAuthToken();
  const formData = new FormData();
  
  formData.append("file", params.file);
  formData.append("dataset_id", params.dataset_id);
  if (params.device_id) {
    formData.append("device_id", params.device_id);
  }

  const res = await fetch(`${API_BASE_URL}/api/images/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to upload image: ${res.statusText} - ${errorText}`);
  }

  return res.json();
}

export async function updateImage(imageId: string, data: ImageUpdate): Promise<Image> {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update image: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteImage(imageId: string): Promise<void> {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete image: ${res.statusText}`);
  }
}

export async function getImageFileUrl(imageId: string, expiresIn = 3600): Promise<string> {
  const token = getAuthToken();
  const params = new URLSearchParams();
  
  if (expiresIn !== 3600) {
    params.append("expires_in", String(expiresIn));
  }

  const url = `${API_BASE_URL}/api/images/${imageId}/preview?${params.toString()}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get image preview URL: ${res.statusText}`);
  }

  const data = await res.json();
  return data.url;
}
