import { Clock, Tag, Activity, ExternalLink } from "lucide-react";
import type { ClassificationResult } from "../types/classification.types";

interface RecentClassificationsProps {
  results: ClassificationResult[];
  onImageClick?: (imageId: string) => void;
}

export function RecentClassifications({ results, onImageClick }: RecentClassificationsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatLabel = (label: string) => {
    return label
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Classifications
        </h3>
        <p className="text-sm text-gray-600 mt-1">Last 10 classification results</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {results.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent classifications</p>
          </div>
        ) : (
          results.map((result) => (
            <button
              key={result.id}
              onClick={() => onImageClick?.(result.image_id)}
              className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {formatLabel(result.label)}
                    </span>
                    {result.model_name && (
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                        {result.model_name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(result.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        ID: {result.image_id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-right ${getConfidenceColor(result.confidence)}`}>
                    <div className="text-lg font-bold">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">confidence</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
