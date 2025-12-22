import { useState, useEffect, useCallback } from "react";
import {
  listClassifications,
  getClassification,
  runClassification as apiRunClassification,
  deleteClassification as apiDeleteClassification,
} from "../api/classifications.api";
import type {
  Classification,
  ClassificationCreate,
  ClassificationListParams,
} from "../types/classification.types";

export function useClassifications(params?: ClassificationListParams) {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract individual param values to use as dependencies
  const statusFilter = params?.status_filter ?? null;
  const datasetId = params?.dataset_id ?? null;
  const imageId = params?.image_id ?? null;
  const createdBy = params?.created_by ?? null;

  const fetchClassifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Reconstruct params object inside callback
      const queryParams: ClassificationListParams = {};
      if (statusFilter) queryParams.status_filter = statusFilter;
      if (datasetId) queryParams.dataset_id = datasetId;
      if (imageId) queryParams.image_id = imageId;
      if (createdBy) queryParams.created_by = createdBy;

      const data = await listClassifications(queryParams);
      setClassifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch classifications");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, datasetId, imageId, createdBy]);

  useEffect(() => {
    fetchClassifications();
  }, [fetchClassifications]);

  const runClassification = async (createParams: ClassificationCreate) => {
    try {
      setError(null);
      const result = await apiRunClassification(createParams);
      await fetchClassifications();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to run classification";
      setError(message);
      throw new Error(message);
    }
  };

  const deleteClassification = async (id: string) => {
    try {
      setError(null);
      await apiDeleteClassification(id);
      await fetchClassifications();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete classification";
      setError(message);
      throw new Error(message);
    }
  };

  return {
    classifications,
    isLoading,
    error,
    runClassification,
    deleteClassification,
    refetch: fetchClassifications,
  };
}

export function useClassification(id: string | null) {
  const [classification, setClassification] = useState<Classification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchClassification = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getClassification(id);
        setClassification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch classification");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassification();
  }, [id]);

  return { classification, isLoading, error };
}
