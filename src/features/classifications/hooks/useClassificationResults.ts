import { useState, useEffect, useCallback } from "react";
import {
  listClassificationResults,
  getResultsForImage,
  getResultsForClassification,
} from "../api/classifications.api";
import type {
  ClassificationResult,
  ClassificationResultListParams,
} from "../types/classification.types";

export function useClassificationResults(params?: ClassificationResultListParams) {
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classificationId = params?.classification_id ?? null;
  const imageId = params?.image_id ?? null;

  const fetchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams: ClassificationResultListParams = {};
      if (classificationId) queryParams.classification_id = classificationId;
      if (imageId) queryParams.image_id = imageId;

      const data = await listClassificationResults(queryParams);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  }, [classificationId, imageId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    isLoading,
    error,
    refetch: fetchResults,
  };
}

export function useImageResults(imageId: string | null) {
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getResultsForImage(imageId);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [imageId]);

  return { results, isLoading, error };
}

export function useClassificationJobResults(classificationId: string | null) {
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classificationId) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getResultsForClassification(classificationId);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [classificationId]);

  return { results, isLoading, error };
}
