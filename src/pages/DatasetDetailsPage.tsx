import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Database, Calendar, User } from "lucide-react";
import { useDataset } from "../features/datasets/hooks/useDatasets";
import { useImages } from "../features/images/hooks/useImages";
import { ImageList } from "../features/images/components/ImageList";
import { ImageUploadModal } from "../features/images/components/ImageUploadModal";
import { ImagePreviewModal } from "../features/images/components/ImagePreviewModal";
import { Button } from "../components/Button";
import { Card, CardBody } from "../components/Card";
import { LoadingSpinner } from "../components/Loading";
import { Alert } from "../components/Alert";
import { Modal } from "../components/Modal";
import type { Image } from "../features/images/types/image.types";

function DatasetDetailsPage() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  
  const { dataset, isLoading: datasetLoading, error: datasetError } = useDataset(datasetId!);
  
  // Memoize the params object to prevent infinite re-renders
  const imageParams = useMemo(() => ({ dataset_id: datasetId }), [datasetId]);
  
  const {
    images,
    isLoading: imagesLoading,
    error: imagesError,
    uploadImage,
    deleteImage,
  } = useImages(imageParams);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<Image | null>(null);

  const handleDelete = async () => {
    if (!deletingImageId) return;
    await deleteImage(deletingImageId);
    setDeletingImageId(null);
  };

  if (datasetLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (datasetError || !dataset) {
    return (
      <Alert variant="error" title="Error loading dataset">
        {datasetError || "Dataset not found"}
      </Alert>
    );
  }

  const formattedDate = new Date(dataset.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/datasets")}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{dataset.name}</h1>
          {dataset.description && (
            <p className="text-gray-600 mt-1">{dataset.description}</p>
          )}
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Dataset Info */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Database className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Images</p>
                <p className="text-lg font-semibold text-gray-900">{images.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="text-lg font-semibold text-gray-900">{dataset.owner_username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-lg font-semibold text-gray-900">{formattedDate}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Images Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
        <ImageList
          images={images}
          isLoading={imagesLoading}
          error={imagesError}
          onEdit={(image) => {
            // TODO: Open edit modal
            console.log("Edit image:", image);
          }}
          onDelete={setDeletingImageId}
          onPreview={setPreviewImage}
        />
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={uploadImage}
        datasetId={datasetId!}
      />

      {/* Preview Modal */}
      <ImagePreviewModal
        image={previewImage}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingImageId}
        onClose={() => setDeletingImageId(null)}
        size="sm"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delete Image?
          </h3>
          <p className="text-gray-600 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeletingImageId(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DatasetDetailsPage;
