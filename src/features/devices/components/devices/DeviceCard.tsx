import type { Device } from "../../types/device.types";

interface DeviceCardProps {
  device: Device;
  onSelect?: (id: string) => void;
}

export function DeviceCard({ device, onSelect }: DeviceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200"
      onClick={() => onSelect?.(device.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{device.name}</h3>
          <p className="text-sm text-gray-500">{device.hostname}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            device.is_online
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {device.is_online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-32">Location:</span>
          <span className="text-gray-900 font-medium">{device.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-32">Firmware:</span>
          <span className="text-gray-900 font-medium">{device.firmware_version}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-32">Last Seen:</span>
          <span className="text-gray-900 font-medium">{formatDate(device.last_seen)}</span>
        </div>
      </div>
    </div>
  );
}
