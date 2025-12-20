import { LoadingSpinner } from "../../../components/Loading";
import { Alert } from "../../../components/Alert";
import { ImageCard } from "./ImageCard";
import type { Image } from "../types/image.types";

interface ImageListProps {
  images: Image[];
  isLoading: boolean;
  error: string | null;
  onEdit: (image: Image) => void;
  onDelete: (imageId: string) => void;
  onPreview: (image: Image) => void;
}

export function ImageList({
  images,
  isLoading,
  error,
  onEdit,
  onDelete,
  onPreview,
}: ImageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading images">
        {error}
      </Alert>
    );
  }

  if (images.length === 0) {
    return (
      <Alert variant="info" title="No images found">
        Upload images to this dataset to get started.
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
