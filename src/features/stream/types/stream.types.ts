export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
  iceCandidatePoolSize?: number;
}

export interface StreamStats {
  bytesReceived: number;
  packetsReceived: number;
  packetsLost: number;
  framesPerSecond: number;
  timestamp: number;
}

export interface WebRTCMessage {
  type: "offer" | "answer" | "ice-candidate";
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
  deviceId?: string;
}

export interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate" | "pong" | "bye";
  sdp?: string;
  candidate?: string | null;
  sdp_mid?: string;
  sdp_m_line_index?: number;
}

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed";

export const ConnectionState = {
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  FAILED: "failed",
} as const;

export interface UseWebRTCProps {
  wsUrl: string;
  config?: WebRTCConfig;
  autoReconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  statsInterval?: number;
  debug?: boolean;
}
