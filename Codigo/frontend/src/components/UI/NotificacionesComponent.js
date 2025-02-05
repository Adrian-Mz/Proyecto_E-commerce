import React, { useState, useEffect, useContext, useRef } from "react";
import { NotificacionesAPI } from "../../api/api.notificaciones";
import { SocketContext } from "../../context/SocketContext";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificacionesComponent = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const data = await NotificacionesAPI.getNotificaciones();
        setNotificaciones(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };

    fetchNotificaciones();

    if (socket) {
      socket.on("nuevaNotificacion", (nuevaNotificacion) => {
        setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
      });
    }
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

  // Filtrar solo las notificaciones NO LEÍDAS y limitar a 5
  const notificacionesNoLeidas = notificaciones.filter((noti) => !noti.leido).slice(0, 5);

  // Manejar el cierre del dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };

    if (mostrarDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mostrarDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        className="relative focus:outline-none"
      >
        <FaBell size={24} className={notificacionesNoLeidas.length > 0 ? "text-yellow-400" : "text-gray-200"} />
        {notificacionesNoLeidas.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full">
            {notificacionesNoLeidas.length}
          </span>
        )}
      </button>

      {mostrarDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
          <div className="p-2 text-gray-700 font-bold border-b">Notificaciones</div>

          {notificacionesNoLeidas.length === 0 ? (
            <div className="p-2 text-gray-500">No tienes notificaciones nuevas</div>
          ) : (
            <ul>
              {notificacionesNoLeidas.map((noti) => (
                <li key={noti.id} className="p-2 border-b flex justify-between items-center text-gray-700">
                  <span className="text-sm">{noti.mensaje}</span>
                  <button
                    onClick={() => marcarComoLeida(noti.id)}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Marcar como leída
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => navigate("/notificaciones")}
            className="w-full text-center py-2 text-gray-700 hover:bg-gray-300 text-sm font-bold disabled:opacity-50"
            disabled={notificaciones.length === 0}
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificacionesComponent;
