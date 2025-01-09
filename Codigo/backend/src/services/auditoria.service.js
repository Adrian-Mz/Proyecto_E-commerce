import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auditoriaService = {
  async registrarAccion({ usuarioId, tabla_afectada, accion, registro, descripcion_cambio }) {
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
  async obtenerRegistros() {
    return await prisma.auditoria.findMany({
      include: { usuario: true }, // Incluir datos del usuario asociado
    });
  },
};
