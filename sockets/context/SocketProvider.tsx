import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";
import {
  acceptanceRequestedSchedule,
} from "../handlers/booking";
import { receiveMessage } from "../handlers/chat";
import { getSocket } from "../socket";

interface SocketContextValue {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const socket = useMemo(() => (token ? getSocket(token) : null), [token]);

  useEffect(() => {
    if (!socket || !token) return;

    socket.connect();

    // Handle authentication errors
    socket.on("connect_error", (err) => {
      console.error("🔌 Socket connection error:", err.message);

      if (err.message === "Authentication failed") {
        useAppStore.getState().logout();
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please log in again.",
          position: "top",
          visibilityTime: 4000,
          swipeable: true,
        });
        router.replace("/(auth)/auth");
      }
    });

    const cleanupReceiveMessage = receiveMessage(socket);
    const cleanupAcceptanceRequestedSchedule =
      acceptanceRequestedSchedule(socket);
    socket.emit("get_unread_conversations_count");

    return () => {
      socket.off("connect_error"); // Clean up the listener
      cleanupReceiveMessage();
      cleanupAcceptanceRequestedSchedule();
      socket.disconnect();
    };
  }, [socket, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  if (!context.socket) throw new Error("Socket is not connected");

  return context.socket;
};
