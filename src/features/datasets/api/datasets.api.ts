import type { Dataset, DatasetMinimal, DatasetCreate, DatasetUpdate } from "../types/dataset.types";
import { apiRequest } from "../../../api/apiClient";

export async function getDatasets(): Promise<Dataset[]> {
  return apiRequest<Dataset[]>("/api/datasets/");
}

export async function getDataset(datasetId: string): Promise<Dataset> {
  return apiRequest<Dataset>(`/api/datasets/${datasetId}`);
}

export async function createDataset(data: DatasetCreate): Promise<DatasetMinimal> {
  return apiRequest<DatasetMinimal>("/api/datasets/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDataset(
  datasetId: string,
  data: DatasetUpdate
): Promise<Dataset> {
  return apiRequest<Dataset>(`/api/datasets/${datasetId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDataset(datasetId: string): Promise<void> {
  return apiRequest<void>(`/api/datasets/${datasetId}`, {
    method: "DELETE",
  });
}
