import { useState } from "react";
import { Video, Wifi, WifiOff } from "lucide-react";
import { useWebRTC } from "../features/stream/hooks/useWebRTC";
import { VideoPlayer } from "../features/stream/components/VideoPlayer";
import { StreamStats } from "../features/stream/components/StreamStats";
import { Button } from "../components/Button";
import { Card, CardBody } from "../components/Card";
import { Input } from "../components/Input";
import { Alert } from "../components/Alert";

function StreamPage() {
  const [deviceId, setDeviceId] = useState("test-device-1");
  const [wsUrl, setWsUrl] = useState("ws://localhost:8001/api/ws/webrtc");

  const { stream, isConnected, isConnecting, error, stats, connect, disconnect } =
    useWebRTC({
      wsUrl,
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Stream</h1>
          <p className="text-gray-600 mt-1">Real-time video streaming via WebRTC</p>
        </div>
        <Video className="w-8 h-8 text-sky-600" />
      </div>

      {/* Connection Configuration */}
      <Card>
        <CardBody>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Connection Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Device ID"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="test-device-1"
                disabled={isConnected || isConnecting}
              />

              <Input
                label="WebSocket URL"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="ws://localhost:8001/api/ws/webrtc"
                disabled={isConnected || isConnecting}
              />
            </div>

            <div className="flex gap-3">
              {!isConnected ? (
                <Button
                  onClick={connect}
                  disabled={isConnecting || !deviceId || !wsUrl}
                  className="flex items-center gap-2"
                >
                  <Wifi className="w-4 h-4" />
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              ) : (
                <Button
                  onClick={disconnect}
                  variant="danger"
                  className="flex items-center gap-2"
                >
                  <WifiOff className="w-4 h-4" />
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Connection Error">
          {error}
        </Alert>
      )}

      {/* Video Player and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer stream={stream} deviceName={`Device: ${deviceId}`} />
        </div>

        <div>
          <StreamStats stats={stats} isConnected={isConnected} />
        </div>
      </div>

      {/* Connection Instructions */}
      {!isConnected && !isConnecting && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to Test WebRTC
            </h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-semibold text-sky-600">1.</span>
                <span>Make sure your backend WebRTC server is running</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-sky-600">2.</span>
                <span>Enter the correct WebSocket URL (default: ws://localhost:8001/api/ws/webrtc)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-sky-600">3.</span>
                <span>Enter a valid device ID that exists in your backend</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-sky-600">4.</span>
                <span>Click "Connect" to establish WebRTC connection</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-sky-600">5.</span>
                <span>The video stream will appear once the connection is established</span>
              </li>
            </ol>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default StreamPage;
