import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UsuariosData = {
  // Obtiene todos los usuarios desde la base de datos
  async getAllUsuarios() {
    return await prisma.usuarios.findMany();
  },

  // Obtener un rol por su nombre
  async getRolPorNombre(nombreRol) {
    return await prisma.roles.findUnique({
      where: { nombre: nombreRol },
    });
  },

  // Obtener un rol por su ID
  async getRolPorId(id) {
    return await prisma.roles.findUnique({
      where: { id },
    });
  },

  // Obtiene un usuario específico por su ID
  async getUsuarioById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }
    return await prisma.usuarios.findUnique({
      where: { id },
    });
  },

  // Crea un nuevo usuario en la base de datos
  async createUsuario(data) {
    if (!data || !data.nombre || !data.correo || !data.password) {
      throw new Error('Faltan datos obligatorios para crear el usuario.');
    }
    return await prisma.usuarios.create({ data });
  },

  // Actualiza un usuario existente en la base de datos
  async updateUsuario(id, data) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }
    return await prisma.usuarios.update({
      where: { id },
      data,
    });
  },

  // Elimina un usuario específico de la base de datos
  async deleteUsuario(id) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }
    return await prisma.usuarios.delete({
      where: { id },
    });
  },

  // Obtiene un usuario específico por su correo
  async getUsuarioByCorreo(correo) {
    return await prisma.usuarios.findUnique({
      where: { correo },
      include: {rol:true},  //Incluye los datos del rol
    });
  },

  // Actualiza la contraseña de un usuario por su correo
  async updatePasswordByCorreo(correo, nuevaPassword) {
    return await prisma.usuarios.update({
      where: { correo },
      data: { password: nuevaPassword },
    });
  },
};