import { useState } from "react";
import { Download, Calendar, FileText, CheckCircle, XCircle, Monitor, Sparkles } from "lucide-react";
import { Badge } from "../../../components/Badge";
import { useImageResults } from "../../classifications/hooks/useClassificationResults";
import { useClassifications } from "../../classifications/hooks/useClassifications";
import { ClassifyImageModal } from "../../classifications/components/ClassifyImageModal";
import { ClassificationResultCard } from "../../classifications/components/ClassificationResultCard";
import { LoadingSpinner } from "../../../components/Loading";
import type { Image } from "../types/image.types";

interface ImagePreviewModalProps {
  image: Image | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePreviewModal({ image, isOpen, onClose }: ImagePreviewModalProps) {
  const [isClassifyModalOpen, setIsClassifyModalOpen] = useState(false);
  
  const { results, isLoading: resultsLoading, refetch: refetchResults } = useImageResults(
    isOpen ? image?.id || null : null
  );
  const { runClassification } = useClassifications();

  if (!image || !isOpen) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const imageUrl = `${API_BASE_URL}/api/images/${image.id}/file`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}/api/images/${image.id}/file?download=true`;
    link.download = image.filename || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClassify = async (params: { image_id?: string; model_name?: string }) => {
    await runClassification(params);
    setTimeout(() => refetchResults(), 1000); // Refetch results after a delay
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Brak daty";
    
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <h2 className="text-xl font-semibold text-slate-100 truncate">{image.filename || "Bez nazwy"}</h2>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => setIsClassifyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Klasyfikuj
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Pobierz
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-xl p-4">
              <img
                src={imageUrl}
                alt={image.filename || "Image"}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            {/* Metadata Sidebar */}
            <div className="lg:w-80 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Szczegóły</h3>
              
              {/* Status */}
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  {image.analyzed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-400" />
                  )}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Status analizy</p>
                    <Badge variant={image.analyzed ? "success" : "warning"}>
                      {image.analyzed ? "Przeanalizowane" : "Oczekuje"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Uploaded At */}
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Data przesłania</p>
                    <p className="text-sm font-medium text-slate-200">{formatDate(image.uploaded_at)}</p>
                  </div>
                </div>
              </div>

              {/* Device ID */}
              {image.device_id && (
                <div className="p-4 bg-slate-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400 mb-1">Urządzenie</p>
                      <p className="text-sm font-medium text-slate-200 break-all">{image.device_id}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Classification Results */}
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
                  Wyniki klasyfikacji
                </h3>
                {resultsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3">
                    {results.map((result) => (
                      <ClassificationResultCard key={result.id} result={result} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">Brak wyników klasyfikacji</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Uruchom klasyfikację aby zobaczyć wyniki
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Zamknij
          </button>
        </div>
      </div>

      {/* Classify Modal */}
      <ClassifyImageModal
        isOpen={isClassifyModalOpen}
        onClose={() => setIsClassifyModalOpen(false)}
        onSubmit={handleClassify}
        imageId={image.id}
        type="image"
      />
    </div>
  );
}
