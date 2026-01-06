import { useAuth } from "@/hooks/useAuth";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Socket } from "socket.io-client";
import { bookingAccepted } from "../handlers/booking";
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

    const cleanupBookingAccepted = bookingAccepted(socket);
    const cleanupReceiveMessage = receiveMessage(socket); // NEW
    socket.emit("get_unread_conversations_count");

    return () => {
      cleanupBookingAccepted();
      cleanupReceiveMessage(); // NEW

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
