import { useDevices } from "../../hooks/useDevices";
import { DeviceCard } from "./DeviceCard";

interface DeviceListProps {
  onDeviceSelect?: (deviceId: string) => void;
}

export function DeviceList({ onDeviceSelect }: DeviceListProps) {
  const { devices, isLoading, error, refetch } = useDevices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading devices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-semibold mb-2">Error loading devices</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
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
        <button
          onClick={refetch}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          Refresh
        </button>
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
