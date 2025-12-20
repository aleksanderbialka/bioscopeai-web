import { Database, Calendar, User } from "lucide-react";
import { Card, CardBody } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import type { Dataset } from "../types/dataset.types";

interface DatasetCardProps {
  dataset: Dataset;
  onEdit: (dataset: Dataset) => void;
  onDelete: (datasetId: string) => void;
  onClick: (datasetId: string) => void;
}

export function DatasetCard({ dataset, onEdit, onDelete, onClick }: DatasetCardProps) {
  const formattedDate = new Date(dataset.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card hover>
      <CardBody>
        <div className="space-y-4">
          {/* Header */}
          <div 
            className="flex items-start justify-between cursor-pointer"
            onClick={() => onClick(dataset.id)}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Database className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {dataset.name}
                </h3>
                {dataset.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {dataset.description}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="info">Dataset</Badge>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{dataset.owner_username}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(dataset);
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(dataset.id);
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
