import { Microscope, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardStatistics } from "../features/classifications/hooks/useDashboardStatistics";
import { StatCard } from "../features/classifications/components/StatCard";
import { RecentClassifications } from "../features/classifications/components/RecentClassifications";
import { LoadingSpinner } from "../components/Loading";
import { Alert } from "../components/Alert";
import { getImage } from "../features/images/api/images.api";

function DashboardPage() {
  const navigate = useNavigate();
  const { statistics, isLoading, error } = useDashboardStatistics();

  const handleImageClick = async (imageId: string) => {
    try {
      const image = await getImage(imageId);
      navigate(`/datasets/${image.dataset_id}?imageId=${imageId}`);
    } catch (err) {
      console.error("Failed to fetch image:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-8">
        <Alert variant="info">No statistics available</Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your classification activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <StatCard
          title="Samples Today"
          value={statistics.classified_last_24_hours}
          subtitle="Last 24 hours"
          icon={<Microscope className="w-6 h-6" />}
          color="blue"
        />
        
        <StatCard
          title="Average Confidence"
          value={`${(statistics.average_confidence * 100).toFixed(1)}%`}
          subtitle="Model accuracy"
          icon={<Target className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Recent Classifications */}
      <RecentClassifications 
        results={statistics.last_10_results}
        onImageClick={handleImageClick}
      />
    </div>
  );
}

export default DashboardPage;
