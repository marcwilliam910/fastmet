import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

let socket: Socket | null = null;

export const getSocket = (
  userId: string,
  userType: "driver" | "client",
  token: string
) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token, // JWT token for authentication
      },
      query: {
        userId,
        userType,
      },
    });
  }
  return socket;
};
