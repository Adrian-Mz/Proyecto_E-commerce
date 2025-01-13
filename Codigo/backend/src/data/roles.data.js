import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rolesData = {
  // Obtener todos los roles
  async getAllRoles() {
    try {
      return await prisma.roles.findMany();
    } catch (error) {
      throw new Error('Error al obtener los roles: ' + error.message);
    }
  },

  // Obtener un rol por ID
  async getRoleById(id) {
    try {
      return await prisma.roles.findUnique({ where: { id } });
    } catch (error) {
      throw new Error('Error al obtener el rol: ' + error.message);
    }
  },

  // Crear un nuevo rol
  async createRole(nombre) {
    try {
      return await prisma.roles.create({ data: { nombre } });
    } catch (error) {
      throw new Error('Error al crear el rol: ' + error.message);
    }
  },
};
