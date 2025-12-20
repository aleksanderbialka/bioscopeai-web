import { useState, useEffect, useCallback } from "react";
import {
  getDatasets,
  getDataset,
  createDataset as apiCreateDataset,
  updateDataset as apiUpdateDataset,
  deleteDataset as apiDeleteDataset,
} from "../api/datasets.api.ts";
import type { Dataset, DatasetCreate, DatasetUpdate } from "../types/dataset.types";

export function useDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDatasets();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch datasets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const createDataset = async (data: DatasetCreate) => {
    setError(null);
    try {
      await apiCreateDataset(data);
      await fetchDatasets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create dataset";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateDataset = async (datasetId: string, data: DatasetUpdate) => {
    setError(null);
    try {
      await apiUpdateDataset(datasetId, data);
      await fetchDatasets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update dataset";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteDataset = async (datasetId: string) => {
    setError(null);
    try {
      await apiDeleteDataset(datasetId);
      await fetchDatasets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete dataset";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    datasets,
    isLoading,
    error,
    fetchDatasets,
    createDataset,
    updateDataset,
    deleteDataset,
  };
}

export function useDataset(datasetId: string) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDataset(datasetId);
      setDataset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dataset");
    } finally {
      setIsLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchDataset();
  }, [fetchDataset]);

  return {
    dataset,
    isLoading,
    error,
    refetch: fetchDataset,
  };
}
