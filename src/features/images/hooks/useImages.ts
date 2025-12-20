import { useState, useEffect, useCallback } from "react";
import {
  getImages,
  getImage,
  uploadImage as apiUploadImage,
  updateImage as apiUpdateImage,
  deleteImage as apiDeleteImage,
} from "../api/images.api.ts";
import type { Image, ImageListParams, ImageUploadParams, ImageUpdate } from "../types/image.types";

export function useImages(params?: ImageListParams) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract individual param values to use as dependencies
  const datasetId = params?.dataset_id;
  const deviceId = params?.device_id;
  const uploadedBy = params?.uploaded_by;
  const analyzed = params?.analyzed;
  const createdFrom = params?.created_from;
  const createdTo = params?.created_to;
  const query = params?.q;
  const page = params?.page;
  const pageSize = params?.page_size;
  const orderBy = params?.order_by;

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Reconstruct params object to avoid stale closure
      const currentParams: ImageListParams | undefined = datasetId || deviceId || uploadedBy !== undefined || 
        analyzed !== undefined || createdFrom || createdTo || query || page || pageSize || orderBy
        ? {
            dataset_id: datasetId,
            device_id: deviceId,
            uploaded_by: uploadedBy,
            analyzed,
            created_from: createdFrom,
            created_to: createdTo,
            q: query,
            page,
            page_size: pageSize,
            order_by: orderBy,
          }
        : undefined;
      
      const data = await getImages(currentParams);
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  }, [datasetId, deviceId, uploadedBy, analyzed, createdFrom, createdTo, query, page, pageSize, orderBy]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadImage = async (uploadParams: ImageUploadParams) => {
    setError(null);
    try {
      await apiUploadImage(uploadParams);
      await fetchImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateImage = async (imageId: string, data: ImageUpdate) => {
    setError(null);
    try {
      await apiUpdateImage(imageId, data);
      await fetchImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update image";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteImage = async (imageId: string) => {
    setError(null);
    try {
      await apiDeleteImage(imageId);
      await fetchImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete image";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    images,
    isLoading,
    error,
    fetchImages,
    uploadImage,
    updateImage,
    deleteImage,
  };
}

export function useImage(imageId: string) {
  const [image, setImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getImage(imageId);
      setImage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch image");
    } finally {
      setIsLoading(false);
    }
  }, [imageId]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return {
    image,
    isLoading,
    error,
    refetch: fetchImage,
  };
}
