import { Activity, Wifi, AlertTriangle } from "lucide-react";
import { Card, CardBody } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import type { StreamStats } from "../types/stream.types";

interface StreamStatsProps {
  stats: StreamStats | null;
  isConnected: boolean;
}

export function StreamStats({ stats, isConnected }: StreamStatsProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getPacketLossPercentage = (): number => {
    if (!stats || !stats.packetsReceived) return 0;
    const total = stats.packetsReceived + stats.packetsLost;
    return ((stats.packetsLost / total) * 100).toFixed(2) as unknown as number;
  };

  return (
    <Card>
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Stream Statistics</h3>
            <Badge variant={isConnected ? "success" : "danger"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Activity className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">FPS</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.framesPerSecond.toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wifi className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data Received</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatBytes(stats.bytesReceived)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Packets Received</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.packetsReceived.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Packet Loss</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getPacketLossPercentage()}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No statistics available
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
