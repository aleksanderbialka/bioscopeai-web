import { LoadingSpinner } from "../../../components/Loading";
import { Alert } from "../../../components/Alert";
import { DatasetCard } from "./DatasetCard";
import type { Dataset } from "../types/dataset.types";

interface DatasetListProps {
  datasets: Dataset[];
  isLoading: boolean;
  error: string | null;
  onEdit: (dataset: Dataset) => void;
  onDelete: (datasetId: string) => void;
  onClick: (datasetId: string) => void;
}

export function DatasetList({
  datasets,
  isLoading,
  error,
  onEdit,
  onDelete,
  onClick,
}: DatasetListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading datasets">
        {error}
      </Alert>
    );
  }

  if (datasets.length === 0) {
    return (
      <Alert variant="info" title="No datasets found">
        Create your first dataset to start organizing images.
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((dataset) => (
        <DatasetCard
          key={dataset.id}
          dataset={dataset}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
