import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { NotificacionesAPI } from "../api/api.notificaciones";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.id) return;

    const newSocket = io("http://localhost:3200");
    newSocket.emit("registrarUsuario", usuario.id);
    setSocket(newSocket);

    const fetchNotificaciones = async () => {
      try {
        const data = await NotificacionesAPI.getNotificaciones();
        const notificacionesUsuario = Array.isArray(data) ? data.filter((n) => n.userId === usuario.id) : [];
        setNotificaciones(notificacionesUsuario);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotificaciones();

    newSocket.on("nuevaNotificacion", (nuevaNotificacion) => {
      if (nuevaNotificacion.userId === usuario.id) {
        setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
      }
    });

    return () => newSocket.disconnect();
  }, []);

  // ✅ Función para marcar una notificación como leída
  const marcarComoLeida = async (id) => {
    try {
      await NotificacionesAPI.marcarComoLeida(id);
      setNotificaciones((prev) => prev.filter((noti) => noti.id !== id));
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notificaciones, marcarComoLeida }}>
      {children}
    </SocketContext.Provider>
  );
};
