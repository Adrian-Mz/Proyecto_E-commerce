import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auditoriaData = {
  // Registrar un evento en la auditoría
  async registrarEvento(usuarioId, tablaAfectada, accion, registro, descripcionCambio = null) {
    try {
      return await prisma.auditoria.create({
        data: {
          usuarioId,
          tabla_afectada: tablaAfectada,
          accion,
          registro: JSON.stringify(registro), // Guardar como JSON
          descripcion_cambio: descripcionCambio,
          fecha_hora: new Date(),
        },
      });
    } catch (error) {
      console.error("Error en capa de datos de auditoría:", error);
      throw new Error("Error al registrar auditoría");
    }
  },

  // Obtener todos los eventos de auditoría
  async obtenerEventos() {
    return await prisma.auditoria.findMany({
      orderBy: { fecha_hora: "desc" },
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, correo: true },
        },
      },
    });
  },
};
