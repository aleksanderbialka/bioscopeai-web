import { apiRequest } from "../../../api/apiClient";
import type {
  Classification,
  ClassificationCreate,
  ClassificationMinimal,
  ClassificationListParams,
  ClassificationResult,
  ClassificationResultListParams,
  DashboardStatistics,
} from "../types/classification.types";

// Classifications
export async function runClassification(
  params: ClassificationCreate
): Promise<ClassificationMinimal> {
  return apiRequest<ClassificationMinimal>("/api/classifications/run", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function listClassifications(
  params?: ClassificationListParams
): Promise<Classification[]> {
  const searchParams = new URLSearchParams();

  if (params?.status_filter) {
    searchParams.append("status_filter", params.status_filter);
  }
  if (params?.dataset_id) {
    searchParams.append("dataset_id", params.dataset_id);
  }
  if (params?.image_id) {
    searchParams.append("image_id", params.image_id);
  }
  if (params?.created_by) {
    searchParams.append("created_by", params.created_by);
  }

  const query = searchParams.toString();
  const url = query ? `/api/classifications/?${query}` : "/api/classifications/";

  return apiRequest<Classification[]>(url);
}

export async function getClassification(id: string): Promise<Classification> {
  return apiRequest<Classification>(`/api/classifications/${id}`);
}

export async function deleteClassification(id: string): Promise<void> {
  await apiRequest<void>(`/api/classifications/${id}`, {
    method: "DELETE",
  });
}

// Classification Results
export async function listClassificationResults(
  params?: ClassificationResultListParams
): Promise<ClassificationResult[]> {
  const searchParams = new URLSearchParams();

  if (params?.classification_id) {
    searchParams.append("classification_id", params.classification_id);
  }
  if (params?.image_id) {
    searchParams.append("image_id", params.image_id);
  }

  const query = searchParams.toString();
  const url = query
    ? `/api/classification-results/?${query}`
    : "/api/classification-results/";

  return apiRequest<ClassificationResult[]>(url);
}

export async function getClassificationResult(
  id: string
): Promise<ClassificationResult> {
  return apiRequest<ClassificationResult>(`/api/classification-results/${id}`);
}

export async function getResultsForClassification(
  classificationId: string
): Promise<ClassificationResult[]> {
  return apiRequest<ClassificationResult[]>(
    `/api/classification-results/classification/${classificationId}`
  );
}

export async function getResultsForImage(
  imageId: string
): Promise<ClassificationResult[]> {
  return apiRequest<ClassificationResult[]>(
    `/api/classification-results/image/${imageId}`
  );
}

// Dashboard Statistics
export async function getDashboardStatistics(): Promise<DashboardStatistics> {
  return apiRequest<DashboardStatistics>(
    "/api/classification-results/today/statistics"
  );
}
