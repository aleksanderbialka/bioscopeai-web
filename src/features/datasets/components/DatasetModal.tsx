import { useState } from "react";
import { X } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import type { Dataset, DatasetCreate, DatasetUpdate } from "../types/dataset.types";

interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatasetCreate | DatasetUpdate) => Promise<void>;
  dataset?: Dataset | null;
}

export function DatasetModal({ isOpen, onClose, onSubmit, dataset }: DatasetModalProps) {
  const [name, setName] = useState(dataset?.name || "");
  const [description, setDescription] = useState(dataset?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        description: description || null,
      });
      onClose();
      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save dataset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {dataset ? "Edit Dataset" : "Create New Dataset"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Dataset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Dataset"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : dataset ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
