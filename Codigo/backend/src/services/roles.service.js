import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const rolesService = {
  async crearRol(nombre) {
    return await prisma.roles.create({ data: { nombre } });
  },
  async obtenerRoles() {
    return await prisma.roles.findMany();
  },
  async asignarRol(usuarioId, rolId) {
    return await prisma.usuarios.update({
      where: { id: usuarioId },
      data: { rolId },
    });
  },
};
