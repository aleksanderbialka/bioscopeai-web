import { Card, CardBody } from "../../../components/Card";
import { Tag, TrendingUp, Calendar, Brain } from "lucide-react";
import type { ClassificationResult } from "../types/classification.types";

interface ClassificationResultCardProps {
  result: ClassificationResult;
}

export function ClassificationResultCard({ result }: ClassificationResultCardProps) {
  const formattedDate = new Date(result.created_at).toLocaleString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const confidencePercent = (result.confidence * 100).toFixed(1);
  const confidenceColor =
    result.confidence >= 0.8
      ? "text-green-600"
      : result.confidence >= 0.5
      ? "text-yellow-600"
      : "text-orange-600";

  return (
    <Card>
      <CardBody className="p-3">
        <div className="space-y-2">
          {/* Label and Confidence */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Tag className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <h3 className="text-sm font-semibold text-gray-900 truncate">{result.label}</h3>
            </div>
            <div className={`flex items-center gap-1 ${confidenceColor} flex-shrink-0`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">{confidencePercent}%</span>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                result.confidence >= 0.8
                  ? "bg-green-500"
                  : result.confidence >= 0.5
                  ? "bg-yellow-500"
                  : "bg-orange-500"
              }`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between gap-3 pt-1.5 border-t border-gray-200 text-xs text-gray-500">
            {result.model_name && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Brain className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{result.model_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
