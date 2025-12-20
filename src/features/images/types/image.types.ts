export interface ImageMinimal {
  id: string;
  filename: string;
  analyzed: boolean;
}

export interface Image {
  id: string;
  dataset_id: string;
  uploaded_by_id: string;
  device_id: string | null;
  filename: string | null;
  filepath: string;
  analyzed: boolean;
  uploaded_at: string;
}

export interface ImageUpdate {
  filename?: string | null;
  analyzed?: boolean | null;
  device_id?: string | null;
}

export interface ImageListParams {
  dataset_id?: string | null;
  device_id?: string | null;
  uploaded_by?: string | null;
  analyzed?: boolean | null;
  created_from?: string | null;
  created_to?: string | null;
  q?: string | null;
  page?: number;
  page_size?: number;
  order_by?: string;
}

export interface ImageUploadParams {
  file: File;
  dataset_id: string;
  device_id?: string | null;
}
