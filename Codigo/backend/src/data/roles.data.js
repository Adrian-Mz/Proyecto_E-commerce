import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rolesData = {
  // Obtener todos los roles
  async getAllRoles() {
    return prisma.roles.findMany();
  },

  // Obtener un rol por ID
  async getRoleById(id) {
    return prisma.roles.findUnique({ where: { id } });
  },

  // Crear un nuevo rol
  async createRole(nombre) {
    return prisma.roles.create({ data: { nombre } });
  },
};
