import React, { useState, useEffect, useContext, useRef } from "react";
import { NotificacionesAPI } from "../../api/api.notificaciones";
import { SocketContext } from "../../context/SocketContext";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotificacionesComponent = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const { socket } = useContext(SocketContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const data = await NotificacionesAPI.getNotificaciones();
        const notificacionesNoLeidas = data.filter((noti) => !noti.leido); // 🔹 Solo traer las no leídas
        setNotificaciones(notificacionesNoLeidas.slice(0, 5)); // 🔹 Limitar a 5 notificaciones
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };
  
    fetchNotificaciones();
  
    if (socket) {
      socket.on("nuevaNotificacion", (nuevaNotificacion) => {
        setNotificaciones((prev) => {
          // 🔹 Evita duplicados asegurándote de que no exista ya la notificación en la lista
          const existe = prev.some((noti) => noti.id === nuevaNotificacion.id);
          if (!existe) {
            return [nuevaNotificacion, ...prev].slice(0, 5);
          }
          return prev;
        });
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
  
      // 🔹 Marcar la notificación como eliminada para la animación
      setNotificaciones((prev) =>
        prev.map((noti) =>
          noti.id === id ? { ...noti, eliminando: true } : noti
        )
      );
  
      // 🔹 Esperar la animación antes de removerla del estado
      setTimeout(() => {
        setNotificaciones((prev) => prev.filter((noti) => noti.id !== id));
      }, 300); // Tiempo suficiente para la animación
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };
  

  // 🔹 Cerrar el dropdown cuando el usuario haga clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificacionesNoLeidas = notificaciones.filter((noti) => !noti.leido);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        className="relative focus:outline-none"
      >
        <FaBell size={24} className={notificacionesNoLeidas.length > 0 ? "text-yellow-400" : "text-gray-200"} />
        {notificacionesNoLeidas.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full"
          >
            {notificacionesNoLeidas.length}
          </motion.span>
        )}
      </button>

      {mostrarDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-md shadow-lg z-50 text-gray-100"
        >
          <div className="p-3 text-gray-300 font-bold border-b border-gray-700">
            Notificaciones
          </div>

          {notificaciones.length === 0 ? (
            <div className="p-3 text-gray-400 text-sm">No hay notificaciones nuevas</div>
          ) : (
            <ul>
              <AnimatePresence>
                {notificaciones.map((noti) => (
                  <motion.li
                    key={noti.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }} // 🔹 Se desvanece y reduce su tamaño
                    transition={{ duration: 0.3 }} // 🔹 Duración de la animación
                    className="p-3 border-b border-gray-700 flex justify-between items-center text-gray-300 text-sm"
                  >
                    <span>{noti.mensaje}</span>
                    <button
                      onClick={() => marcarComoLeida(noti.id)}
                      className="text-blue-400 hover:text-blue-500 text-xs"
                    >
                      ✔
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          <button
            onClick={() => navigate("/notificaciones")}
            className="w-full text-center py-2 text-gray-300 hover:bg-gray-700 text-sm font-bold disabled:opacity-50"
            disabled={notificaciones.length === 0}
          >
            Ver todas las notificaciones
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NotificacionesComponent;
