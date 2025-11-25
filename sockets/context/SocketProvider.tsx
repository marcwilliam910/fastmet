import React, { createContext, useContext, useEffect } from "react";
import { bookingAccepted } from "../handlers/booking";
import { getSocket } from "../socket";

interface SocketContextType {
  socket: ReturnType<typeof getSocket>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, token } = useAuth(); // Get from auth context
  const socket = getSocket("4UIcFUjHf4NngY1OJhcrUdp46Fe2", "client", "token");
  useEffect(() => {
    socket.connect();

    // // Always-on listeners (like messaging)
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      // Register listener after connection
      bookingAccepted(socket);
    });

    return () => {
      // socket.off("receive_message", onNewMessage);
      socket.off("bookingAccepted"); // remove all for safety

      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context.socket;
};
