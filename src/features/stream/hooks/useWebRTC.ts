import { useEffect, useRef, useState, useCallback } from "react";
import type { WebRTCConfig, StreamStats } from "../types/stream.types";

interface UseWebRTCProps {
  wsUrl: string;
  config?: WebRTCConfig;
}

export function useWebRTC({ wsUrl, config }: UseWebRTCProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StreamStats | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const statsIntervalRef = useRef<number | null>(null);

  const collectStats = useCallback(async () => {
    if (!peerConnectionRef.current) return;

    try {
      const stats = await peerConnectionRef.current.getStats();
      let bytesReceived = 0;
      let packetsReceived = 0;
      let packetsLost = 0;
      let framesPerSecond = 0;

      stats.forEach((report) => {
        if (report.type === "inbound-rtp" && report.kind === "video") {
          bytesReceived = report.bytesReceived || 0;
          packetsReceived = report.packetsReceived || 0;
          packetsLost = report.packetsLost || 0;
          framesPerSecond = report.framesPerSecond || 0;
        }
      });

      setStats({
        bytesReceived,
        packetsReceived,
        packetsLost,
        framesPerSecond,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Failed to collect stats:", err);
    }
  }, []);

  // Initialize WebRTC connection
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    const defaultConfig: WebRTCConfig = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    };
    
    console.log("Using ICE servers:", config || defaultConfig);

    try {
      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection failed");
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setIsConnected(false);
      };

      // Create peer connection
      const pc = new RTCPeerConnection(config || defaultConfig);
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        console.log("Received remote track:", event.track.kind);
        const [remoteStream] = event.streams;
        setStream(remoteStream);
        setIsConnected(true);
        setIsConnecting(false);

        statsIntervalRef.current = window.setInterval(collectStats, 1000);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && ws.readyState === WebSocket.OPEN) {
          console.log("Sending ICE candidate:", event.candidate);
          ws.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: `candidate:${event.candidate.candidate}`,
              sdp_mid: event.candidate.sdpMid,
              sdp_m_line_index: event.candidate.sdpMLineIndex,
            })
          );
        } else if (!event.candidate && ws.readyState === WebSocket.OPEN) {
          console.log("ICE gathering complete, sending end-of-candidates");
          ws.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: null,
            })
          );
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          console.log("WebRTC connected successfully!");
        } else if (pc.connectionState === "failed") {
          console.error("Connection failed. ICE state:", pc.iceConnectionState);
          setError("WebRTC connection failed - ICE connectivity issue");
          setIsConnected(false);
          setIsConnecting(false);
        } else if (pc.connectionState === "disconnected") {
          console.warn("Connection disconnected");
          setIsConnected(false);
        }
      };

      // Handle WebSocket messages
      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Received WebSocket message:", message.type);

          if (message.type === "answer") {
            // Receive answer from server
            console.log("Received answer from server");
            await pc.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: message.sdp,
              })
            );
            console.log("Remote description set successfully");
          } else if (message.type === "ice-candidate") {
            // Add ICE candidate from server
            if (message.candidate) {
              console.log("Received ICE candidate from server:", message.candidate);
              await pc.addIceCandidate(
                new RTCIceCandidate({
                  candidate: message.candidate,
                  sdpMid: message.sdp_mid,
                  sdpMLineIndex: message.sdp_m_line_index,
                })
              );
              console.log("ICE candidate added successfully");
            } else {
              console.log("Received end-of-candidates from server");
            }
          } else if (message.type === "pong") {
            // Heartbeat response
            console.log("Received pong from server");
          }
        } catch (err) {
          console.error("Error handling WebSocket message:", err);
          setError("Failed to process signaling message");
        }
      };

      ws.onopen = async () => {
        console.log("WebSocket connected, creating offer...");
        
        try {
          // Create offer with explicit constraints (browser is the offerer)
          const offer = await pc.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: true,
          });
          console.log("Offer created, setting local description...");
          
          await pc.setLocalDescription(offer);
          console.log("Local description set, ICE state:", pc.iceGatheringState);

          console.log("Sending offer to server...");
          ws.send(
            JSON.stringify({
              type: "offer",
              sdp: pc.localDescription?.sdp,
            })
          );

          console.log("Offer sent successfully. ICE candidates will be sent as they arrive.");
        } catch (err) {
          console.error("Failed to create offer:", err);
          setError("Failed to create WebRTC offer");
          setIsConnecting(false);
        }
      };
    } catch (err) {
      console.error("Failed to connect:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      setIsConnecting(false);
    }
  }, [wsUrl, config, collectStats]);

  // Disconnect and cleanup
  const disconnect = useCallback(() => {
    if (statsIntervalRef.current) {
      window.clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "bye" }));
      wsRef.current.close();
      wsRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setStream(null);
    setIsConnected(false);
    setIsConnecting(false);
    setStats(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    stream,
    isConnected,
    isConnecting,
    error,
    stats,
    connect,
    disconnect,
  };
}
