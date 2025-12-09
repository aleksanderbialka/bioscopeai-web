import { useDevices } from "../../hooks/useDevices";
import { DeviceCard } from "./DeviceCard";
import { LoadingSpinner } from "../../../../components/Loading";
import { Alert } from "../../../../components/Alert";
import { Button } from "../../../../components/Button";

interface DeviceListProps {
  onDeviceSelect?: (deviceId: string) => void;
}

export function DeviceList({ onDeviceSelect }: DeviceListProps) {
  const { devices, isLoading, error, refetch } = useDevices();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 mt-4">Loading devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading devices">
        <div className="flex items-center justify-between">
          <p>{error}</p>
          <Button variant="danger" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600 text-lg mb-2">No devices found</p>
        <p className="text-gray-500 text-sm">Add your first device to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {devices.length} {devices.length === 1 ? "Device" : "Devices"}
        </h2>
        <Button variant="primary" size="md" onClick={refetch}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onSelect={onDeviceSelect}
          />
        ))}
      </div>
    </div>
  );
}
