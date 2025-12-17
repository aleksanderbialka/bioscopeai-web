export interface WebRTCConfig {
  iceServers: RTCIceServer[];
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
