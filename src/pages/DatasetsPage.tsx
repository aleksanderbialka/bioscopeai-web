import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Plus } from "lucide-react";
import { useDatasets } from "../features/datasets/hooks/useDatasets";
import { DatasetList } from "../features/datasets/components/DatasetList";
import { DatasetModal } from "../features/datasets/components/DatasetModal";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import type { Dataset, DatasetCreate, DatasetUpdate } from "../features/datasets/types/dataset.types";

function DatasetsPage() {
  const navigate = useNavigate();
  const { datasets, isLoading, error, createDataset, updateDataset, deleteDataset } = useDatasets();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  const [deletingDatasetId, setDeletingDatasetId] = useState<string | null>(null);

  const handleCreate = async (data: DatasetCreate | DatasetUpdate) => {
    await createDataset(data as DatasetCreate);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (data: DatasetCreate | DatasetUpdate) => {
    if (!editingDataset) return;
    await updateDataset(editingDataset.id, data as DatasetUpdate);
    setEditingDataset(null);
  };

  const handleDelete = async () => {
    if (!deletingDatasetId) return;
    await deleteDataset(deletingDatasetId);
    setDeletingDatasetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Datasets</h1>
          <p className="text-gray-600 mt-1">Organize and manage your image datasets</p>
        </div>
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-sky-600" />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Dataset
          </Button>
        </div>
      </div>

      {/* Dataset List */}
      <DatasetList
        datasets={datasets}
        isLoading={isLoading}
        error={error}
        onEdit={setEditingDataset}
        onDelete={setDeletingDatasetId}
        onClick={(id) => navigate(`/datasets/${id}`)}
      />

      {/* Create Modal */}
      <DatasetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      <DatasetModal
        isOpen={!!editingDataset}
        onClose={() => setEditingDataset(null)}
        onSubmit={handleUpdate}
        dataset={editingDataset}
      />

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingDatasetId}
        onClose={() => setDeletingDatasetId(null)}
        size="sm"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delete Dataset?
          </h3>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. All images in this dataset will also be deleted.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeletingDatasetId(null)}
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

export default DatasetsPage;
