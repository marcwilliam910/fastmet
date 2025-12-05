import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_BASE_URL;

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token, // JWT token for authentication
      },
      transports: ["websocket", "polling"], // Fallback to polling if WebSocket fails
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000, // Connection timeout
    });
  }
  return socket;
};
