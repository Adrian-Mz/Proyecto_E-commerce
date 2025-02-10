import React, { useEffect, useState } from "react";
import { NotificacionesAPI } from "../../api/api.notificaciones";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";

const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const data = await NotificacionesAPI.getNotificaciones();
        setNotificaciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-lg min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <FaEnvelopeOpenText className="mr-2 text-gray-500" />
        Notificaciones
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando notificaciones...</p>
      ) : notificaciones.length === 0 ? (
        <p className="text-center text-gray-500">No tienes notificaciones pendientes.</p>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {notificaciones.map((noti) => (
              <motion.div
                key={noti.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-5 bg-gray-100 rounded-md shadow-md border ${
                  noti.leido ? "opacity-50 line-through" : "border-blue-500"
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
