import { PrismaClient } from "@prisma/client";
import { connectedClients } from "../index.js";

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

  // Obtener notificaciones según el rol del usuario
  async obtenerNotificaciones(usuarioId) {
    // Obtener el usuario junto con su rol
    const usuario = await prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { rol: { select: { nombre: true } } },
    });

    if (!usuario) throw new Error("Usuario no encontrado");

    // Si es administrador, obtiene todas las notificaciones
    if (usuario.rol.nombre === "Administrador") {
      return await prisma.notificaciones.findMany({
        orderBy: { fechaCreacion: "desc" },
        include: {
          usuario: {
            select: { nombre: true, apellido: true, rol: { select: { nombre: true } } },
          },
        },
      });
    }

    // Si es usuario normal, obtiene solo sus notificaciones
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
