import { useEffect, useRef, useState, useCallback } from "react";
import type {
  WebRTCConfig,
  StreamStats,
  SignalingMessage,
  ConnectionState,
  UseWebRTCProps,
} from "../types/stream.types";
import { ConnectionState as ConnectionStateEnum } from "../types/stream.types";

const DEFAULT_CONFIG: WebRTCConfig = {
  iceServers: [
    {
      urls: ["turn:localhost:3478?transport=tcp"],
      username: "dev",
      credential: "devpass",
    },
  ],
  iceTransportPolicy: "relay",
  iceCandidatePoolSize: 10,
};

const DEFAULT_RECONNECT_DELAY = 3000;
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5;
const DEFAULT_STATS_INTERVAL = 1000;

export function useWebRTC({
  wsUrl,
  config,
  autoReconnect = true,
  reconnectDelay = DEFAULT_RECONNECT_DELAY,
  maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS,
  statsInterval = DEFAULT_STATS_INTERVAL,
  debug = false,
}: UseWebRTCProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionStateEnum.DISCONNECTED
  );
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const statsIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const isCleaningUpRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const connectFnRef = useRef<(() => Promise<void>) | null>(null);

  const log = useCallback(
    (level: "info" | "warn" | "error", message: string, ...args: unknown[]) => {
      if (!debug && level === "info") return;
      console[level](`[WebRTC]`, message, ...args);
    },
    [debug]
  );

  const collectStats = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      const statsReport = await pc.getStats();
      
      for (const report of statsReport.values()) {
        if (report.type === "inbound-rtp" && report.kind === "video") {
          setStats({
            bytesReceived: report.bytesReceived || 0,
            packetsReceived: report.packetsReceived || 0,
            packetsLost: report.packetsLost || 0,
            framesPerSecond: report.framesPerSecond || 0,
            timestamp: Date.now(),
          });
          return;
        }
      }
    } catch (err) {
      if (debug) console.error("[WebRTC]", "Stats collection failed", err);
    }
  }, [debug]);

  const startStatsCollection = useCallback(() => {
    if (statsIntervalRef.current) return;
    statsIntervalRef.current = setInterval(collectStats, statsInterval);
  }, [collectStats, statsInterval]);

  const stopStatsCollection = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
      setStats(null);
    }
  }, []);

  const sendSignalingMessage = useCallback(
    (message: SignalingMessage) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        log("warn", "Cannot send message - WebSocket not ready", message.type);
        return false;
      }

      try {
        ws.send(JSON.stringify(message));
        log("info", "Sent", message.type);
        return true;
      } catch (err) {
        log("error", "Failed to send message", err);
        return false;
      }
    },
    [log]
  );

  const handleIceCandidate = useCallback(
    (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        log("info", "ICE candidate", event.candidate.type, event.candidate.protocol);

        sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate.candidate,
          sdp_mid: event.candidate.sdpMid ?? undefined,
          sdp_m_line_index: event.candidate.sdpMLineIndex ?? undefined,
        });
      } else {
        log("info", "ICE gathering complete");
        sendSignalingMessage({
          type: "ice-candidate",
          candidate: null,
        });
      }
    },
    [sendSignalingMessage, log]
  );

  const handleIceConnectionStateChange = useCallback(() => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    log("info", "ICE state", pc.iceConnectionState);

    if (pc.iceConnectionState === "failed" && autoReconnect) {
      log("error", "ICE failed - attempting restart");
      pc.restartIce();
    }
  }, [log, autoReconnect]);

  const processPendingCandidates = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc?.remoteDescription) return;

    const candidates = pendingCandidatesRef.current;
    if (candidates.length === 0) return;

    log("info", `Processing ${candidates.length} pending candidates`);
    pendingCandidatesRef.current = [];

    await Promise.allSettled(
      candidates.map(candidate => 
        pc.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(err => log("error", "Failed to add pending candidate", err))
      )
    );
  }, [log]);

  const handleSignalingMessage = useCallback(
    async (data: string) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        const message: SignalingMessage = JSON.parse(data);
        log("info", "Received", message.type);

        switch (message.type) {
          case "answer":
            if (!message.sdp) {
              log("error", "Answer missing SDP");
              break;
            }

            await pc.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: message.sdp,
              })
            );

            await processPendingCandidates();
            break;

          case "ice-candidate":
            if (message.candidate) {
              const candidateString = typeof message.candidate === "string" && 
                !message.candidate.startsWith("candidate:") 
                  ? `candidate:${message.candidate}`
                  : message.candidate;

              const candidateInit: RTCIceCandidateInit = {
                candidate: candidateString,
                sdpMid: message.sdp_mid,
                sdpMLineIndex: message.sdp_m_line_index,
              };

              if (!pc.remoteDescription) {
                pendingCandidatesRef.current.push(candidateInit);
              } else {
                await pc.addIceCandidate(new RTCIceCandidate(candidateInit))
                  .catch(err => log("error", "Failed to add ICE candidate", err));
              }
            }
            break;

          case "pong":
            break;

          default:
            log("warn", "Unknown message type", message.type);
        }
      } catch (err) {
        log("error", "Failed to handle message", err);
        setError("Failed to process signaling message");
      }
    },
    [log, processPendingCandidates]
  );

  const createOffer = useCallback(async () => {
    const pc = peerConnectionRef.current;
    const ws = wsRef.current;

    if (!pc || !ws || ws.readyState !== WebSocket.OPEN) {
      log("error", "Cannot create offer - not ready");
      return;
    }

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true,
      });

      await pc.setLocalDescription(offer);

      sendSignalingMessage({
        type: "offer",
        sdp: pc.localDescription?.sdp,
      });

      log("info", "Offer sent");
    } catch (err) {
      log("error", "Failed to create offer", err);
      setError("Failed to create offer");
      setConnectionState(ConnectionStateEnum.FAILED);
    }
  }, [sendSignalingMessage, log]);

  const connect = useCallback(async () => {
    if (
      connectionState === ConnectionStateEnum.CONNECTING ||
      connectionState === ConnectionStateEnum.CONNECTED
    ) {
      log("warn", "Already connected or connecting");
      return;
    }

    log("info", "Connecting...");
    setConnectionState(ConnectionStateEnum.CONNECTING);
    setError(null);
    isCleaningUpRef.current = false;

    const scheduleReconnect = () => {
      if (
        !autoReconnect ||
        reconnectAttempts >= maxReconnectAttempts ||
        reconnectTimeoutRef.current
      ) {
        return;
      }

      const attempt = reconnectAttempts + 1;
      setReconnectAttempts(attempt);

      log("info", `Reconnecting (${attempt}/${maxReconnectAttempts}) in ${reconnectDelay}ms`);
      setConnectionState(ConnectionStateEnum.RECONNECTING);

      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connectFnRef.current?.();
      }, reconnectDelay);
    };

    const handleTrack = (event: RTCTrackEvent) => {
      log("info", "Received track", event.track.kind);
      const [remoteStream] = event.streams;
      
      if (remoteStream) {
        setStream(remoteStream);
        setConnectionState(ConnectionStateEnum.CONNECTED);
      }
    };

    const handleConnectionStateChange = () => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      log("info", "Connection state", pc.connectionState);

      switch (pc.connectionState) {
        case "connected":
          setConnectionState(ConnectionStateEnum.CONNECTED);
          setError(null);
          setReconnectAttempts(0);
          startStatsCollection();
          break;

        case "connecting":
          setConnectionState(ConnectionStateEnum.CONNECTING);
          break;

        case "disconnected":
          setConnectionState(ConnectionStateEnum.DISCONNECTED);
          stopStatsCollection();
          break;

        case "failed":
          log("error", "Connection failed");
          setConnectionState(ConnectionStateEnum.FAILED);
          setError("Connection failed - check network");
          stopStatsCollection();
          scheduleReconnect();
          break;

        case "closed":
          setConnectionState(ConnectionStateEnum.DISCONNECTED);
          stopStatsCollection();
          break;
      }
    };

    const setupWebSocket = (ws: WebSocket) => {
      ws.onopen = () => {
        log("info", "WebSocket connected");
        createOffer();
      };

      ws.onmessage = (event) => {
        handleSignalingMessage(event.data);
      };

      ws.onerror = () => {
        log("error", "WebSocket error");
        setError("WebSocket connection failed");
        setConnectionState(ConnectionStateEnum.FAILED);
      };

      ws.onclose = () => {
        log("info", "WebSocket closed");
        if (!isCleaningUpRef.current) {
          setConnectionState(ConnectionStateEnum.DISCONNECTED);
          scheduleReconnect();
        }
      };
    };

    const setupPeerConnection = (pc: RTCPeerConnection) => {
      pc.ontrack = handleTrack;
      pc.onicecandidate = handleIceCandidate;
      pc.oniceconnectionstatechange = handleIceConnectionStateChange;
      pc.onconnectionstatechange = handleConnectionStateChange;
    };

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const rtcConfig = config || DEFAULT_CONFIG;
      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = pc;

      setupWebSocket(ws);
      setupPeerConnection(pc);
    } catch (err) {
      log("error", "Connection failed", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      setConnectionState(ConnectionStateEnum.FAILED);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, config]);

  useEffect(() => {
    connectFnRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    log("info", "Disconnecting...");
    isCleaningUpRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopStatsCollection();

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        sendSignalingMessage({ type: "bye" });
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setStream(null);
    setConnectionState(ConnectionStateEnum.DISCONNECTED);
    setError(null);
    setReconnectAttempts(0);
    pendingCandidatesRef.current = [];
  }, [log, sendSignalingMessage, stopStatsCollection]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    stream,
    connectionState,
    isConnected: connectionState === ConnectionStateEnum.CONNECTED,
    isConnecting:
      connectionState === ConnectionStateEnum.CONNECTING ||
      connectionState === ConnectionStateEnum.RECONNECTING,
    error,
    stats,
    reconnectAttempts,
    connect,
    disconnect,
  };
}
