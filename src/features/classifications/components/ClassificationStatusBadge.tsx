import { Badge } from "../../../components/Badge";
import { Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import type { ClassificationStatus } from "../types/classification.types";

interface ClassificationStatusBadgeProps {
  status: ClassificationStatus;
  showIcon?: boolean;
}

export function ClassificationStatusBadge({ status, showIcon = true }: ClassificationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          variant: "neutral" as const,
          icon: Clock,
          label: "Oczekuje",
        };
      case "running":
        return {
          variant: "info" as const,
          icon: Loader2,
          label: "W trakcie",
        };
      case "completed":
        return {
          variant: "success" as const,
          icon: CheckCircle,
          label: "Ukończono",
        };
      case "failed":
        return {
          variant: "danger" as const,
          icon: XCircle,
          label: "Błąd",
        };
      default:
        return {
          variant: "neutral" as const,
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      {showIcon && (
        <Icon className={`w-3.5 h-3.5 mr-1.5 ${status === "running" ? "animate-spin" : ""}`} />
      )}
      {config.label}
    </Badge>
  );
}
