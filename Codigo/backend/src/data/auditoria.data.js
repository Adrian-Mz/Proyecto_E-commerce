import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auditoriaData = {
  // Crear un registro en la tabla de auditoría
  async crearRegistro({ usuarioId, tabla_afectada, accion, registro, descripcion_cambio }) {
    return await prisma.auditoria.create({
      data: {
        usuarioId,
        tabla_afectada,
        accion,
        registro,
        descripcion_cambio,
        fecha_hora: new Date(),
      },
    });
  },

  // Obtener todos los registros de auditoría
  async obtenerRegistros() {
    return await prisma.auditoria.findMany({
      include: { usuario: true }, // Incluir datos del usuario asociado
      orderBy: { fecha_hora: "desc" }, // Ordenar por la fecha más reciente
    });
  },

  // Obtener un registro específico por ID
  async obtenerRegistroPorId(id) {
    return await prisma.auditoria.findUnique({
      where: { id },
      include: { usuario: true },
    });
  },
};
