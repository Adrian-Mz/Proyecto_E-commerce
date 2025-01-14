import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const rolesService = {
  // Crear un nuevo rol
  async crearRol(nombre) {
    try {
      return await prisma.roles.create({ data: { nombre } });
    } catch (error) {
      throw new Error('Error al crear el rol: ' + error.message);
    }
  },

  // Obtener todos los roles
  async obtenerRoles() {
    try {
      return await prisma.roles.findMany();
    } catch (error) {
      throw new Error('Error al obtener los roles: ' + error.message);
    }
  },

  // Asignar un rol a un usuario
  async asignarRol(usuarioId, rolId) {
    try {
      // Verificar si el rol existe
      const rol = await prisma.roles.findUnique({ where: { id: rolId } });
      if (!rol) {
        throw new Error('El rol especificado no existe.');
      }

      // Verificar si el usuario existe
      const usuario = await prisma.usuarios.findUnique({ where: { id: usuarioId } });
      if (!usuario) {
        throw new Error('El usuario especificado no existe.');
      }

      // Asignar el rol al usuario
      return await prisma.usuarios.update({
        where: { id: usuarioId },
        data: { rolId },
        include: { rol: true },
      });
    } catch (error) {
      throw new Error('Error al asignar el rol: ' + error.message);
    }
  },
};
