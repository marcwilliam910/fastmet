import { useAuth } from "@/hooks/useAuth";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Socket } from "socket.io-client";
import { bookingAccepted } from "../handlers/booking";
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
    if (!socket) return;

    socket.connect();

    const cleanupBookingAccepted = bookingAccepted(socket);

    return () => {
      cleanupBookingAccepted();

      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
