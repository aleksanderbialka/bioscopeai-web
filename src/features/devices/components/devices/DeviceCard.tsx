import type { Device } from "../../types/device.types";
import { Card, CardBody } from "../../../../components/Card";
import { Badge } from "../../../../components/Badge";

interface DeviceCardProps {
  device: Device;
  onSelect?: (id: string) => void;
}

export function DeviceCard({ device, onSelect }: DeviceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card hover onClick={() => onSelect?.(device.id)}>
      <CardBody>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.hostname}</p>
          </div>
          <Badge variant={device.is_online ? "success" : "danger"}>
            {device.is_online ? "Online" : "Offline"}
          </Badge>
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
      </CardBody>
    </Card>
  );
}
