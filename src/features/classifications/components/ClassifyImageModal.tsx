import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Sparkles } from "lucide-react";

interface ClassifyImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: { image_id?: string; dataset_id?: string; model_name?: string }) => Promise<void>;
  imageId?: string;
  datasetId?: string;
  type: "image" | "dataset";
}

export function ClassifyImageModal({
  isOpen,
  onClose,
  onSubmit,
  imageId,
  datasetId,
  type,
}: ClassifyImageModalProps) {
  const [modelName, setModelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);

      const params: { image_id?: string; dataset_id?: string; model_name?: string } = {
        model_name: modelName || undefined,
      };

      if (type === "image" && imageId) {
        params.image_id = imageId;
      } else if (type === "dataset" && datasetId) {
        params.dataset_id = datasetId;
      }

      await onSubmit(params);
      setModelName("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start classification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setModelName("");
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              {type === "image" ? "Klasyfikuj obraz" : "Klasyfikuj dataset"}
            </h2>
            <p className="text-sm text-slate-400">
              {type === "image"
                ? "Uruchom klasyfikację dla wybranego obrazu"
                : "Uruchom klasyfikację dla wszystkich obrazów w datasecie"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-slate-300 mb-2">
              Nazwa modelu (opcjonalnie)
            </label>
            <Input
              id="modelName"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="np. resnet50, mobilenet..."
            />
            <p className="text-xs text-slate-400 mt-1">
              Pozostaw puste aby użyć domyślnego modelu
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Uruchamianie..." : "Rozpocznij klasyfikację"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
