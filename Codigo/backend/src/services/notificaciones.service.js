import { PrismaClient } from "@prisma/client";
import { connectedClients } from "../index.js"; // ✅ Importamos `connectedClients`

const prisma = new PrismaClient();

export const notificacionesService = {
  // Crear una nueva notificación y enviarla en tiempo real
  async crearNotificacion(usuarioId, mensaje, tipo) {
    const notificacion = await prisma.notificaciones.create({
      data: {
        usuarioId,
        mensaje,
        tipo,
      },
    });

    // Enviar la notificación en tiempo real si el usuario está conectado
    const usuarioSocket = connectedClients.get(usuarioId);
    if (usuarioSocket) {
      usuarioSocket.emit("nuevaNotificacion", notificacion);
    }

    return notificacion;
  },

  // Obtener notificaciones de un usuario
  async obtenerNotificaciones(usuarioId) {
    return await prisma.notificaciones.findMany({
      where: { usuarioId },
      orderBy: { fechaCreacion: "desc" },
    });
  },

  // Marcar notificaciones como leídas
  async marcarComoLeida(notificacionId) {
    return await prisma.notificaciones.update({
      where: { id: notificacionId },
      data: { leido: true },
    });
  },
};
