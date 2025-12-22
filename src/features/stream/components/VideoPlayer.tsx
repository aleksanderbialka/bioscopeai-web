import { useEffect, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../../../components/Button";

interface VideoPlayerProps {
  stream: MediaStream | null;
  deviceName?: string;
}

export function VideoPlayer({ stream, deviceName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden shadow-xl group"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto"
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="font-semibold">{deviceName || "Device Stream"}</p>
              <p className="text-sm text-gray-300">Live</p>
            </div>

            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              {document.fullscreenElement ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* No stream placeholder */}
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <p className="text-gray-400">No stream available</p>
        </div>
      )}
    </div>
  );
}
