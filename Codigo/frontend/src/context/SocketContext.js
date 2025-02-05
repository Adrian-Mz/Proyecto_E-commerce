import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.id) return;

    const newSocket = io("http://localhost:3200");

    newSocket.emit("registrarUsuario", usuario.id);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
