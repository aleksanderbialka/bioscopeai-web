export type ClassificationStatus = "pending" | "running" | "completed" | "failed";

export interface ClassificationCreate {
  dataset_id?: string | null;
  image_id?: string | null;
  model_name?: string | null;
}

export interface ClassificationMinimal {
  id: string;
  status: ClassificationStatus;
}

export interface Classification {
  id: string;
  dataset_id: string | null;
  image_id: string | null;
  model_name: string;
  status: ClassificationStatus;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClassificationListParams {
  status_filter?: string | null;
  dataset_id?: string | null;
  image_id?: string | null;
  created_by?: string | null;
}

export interface ClassificationResult {
  id: string;
  image_id: string;
  classification_id: string | null;
  label: string;
  confidence: number;
  model_name: string | null;
  created_at: string;
}

export interface ClassificationResultListParams {
  classification_id?: string | null;
  image_id?: string | null;
}
