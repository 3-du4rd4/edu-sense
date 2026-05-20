import { WebSocketMessage } from "@/types/websocket";

type MessageHandler = (message: WebSocketMessage) => void;

export function createWebSocketConnection(
  userId: string,
  onMessage: MessageHandler,
): WebSocket {
  const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";

  const socket = new WebSocket(`${wsBaseUrl}/ws/${userId}`);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      onMessage(message);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}
