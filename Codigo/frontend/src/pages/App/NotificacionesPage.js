import React, { useState, useEffect, useContext } from "react";
import { NotificacionesAPI } from "../../api/api.notificaciones";
import { motion, AnimatePresence } from "framer-motion";
import { SocketContext } from "../../context/SocketContext";

const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.rol?.nombre) {
          setUsuario(parsedUser);
        } else {
          console.warn("⚠ Usuario en localStorage no tiene un rol válido:", parsedUser);
        }
      }
    } catch (error) {
      console.error("Error al leer usuario del localStorage:", error);
    }

    const fetchNotificaciones = async () => {
      try {
        const data = await NotificacionesAPI.getNotificaciones();
        console.log("📩 Notificaciones recibidas:", data);
        setNotificaciones(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificaciones();

    if (socket) {
      socket.on("nuevaNotificacion", (nuevaNotificacion) => {
        setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off("nuevaNotificacion");
      }
    };
  }, [socket]);

  const marcarComoLeida = async (id) => {
    try {
      await NotificacionesAPI.marcarComoLeida(id);
      setNotificaciones((prev) =>
        prev.map((noti) => (noti.id === id ? { ...noti, leido: true } : noti))
      );
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  if (!usuario || !usuario.rol) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-lg min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">📩 Notificaciones</h2>
        <p className="text-center text-gray-500">Cargando usuario...</p>
      </div>
    );
  }

  // Filtrar notificaciones solo del usuario actual
  const notificacionesFiltradas = notificaciones.filter(
    (noti) => noti.usuarioId === usuario.id
  );

  console.log("🔍 Notificaciones filtradas:", notificacionesFiltradas);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-lg min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">📩 Notificaciones</h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando notificaciones...</p>
      ) : notificacionesFiltradas.length === 0 ? (
        <p className="text-center text-gray-500">No tienes notificaciones pendientes.</p>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {notificacionesFiltradas.map((noti) => (
              <motion.div
                key={noti.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-5 mt-4 rounded-md shadow-md flex flex-col space-y-2 ${
                  noti.leido ? "bg-gray-200 text-gray-500 line-through" : "bg-gray-100"
                }`}
              >
                <p className="text-lg font-medium">{noti.mensaje}</p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(noti.fechaCreacion).toLocaleString()} | 🏷 {noti.tipo}
                </p>
                {!noti.leido && (
                  <button
                    onClick={() => marcarComoLeida(noti.id)}
                    className="self-end text-sm text-blue-500 hover:text-blue-600"
                  >
                    ✔ Marcar como leída
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default NotificacionesPage;
