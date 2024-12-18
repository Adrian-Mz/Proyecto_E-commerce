import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UsuariosData = {
  // Función para obtener todos los usuarios
  async getAllUsuarios() {
    return await prisma.usuarios.findMany();
  },

  // Función para obtener un usuario por su ID
  async getUsuarioById(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.usuarios.findUnique({
      where: { id },
    });
  },

  // Función para crear un usuario
  async createUsuario(data) {
    if (
      !data ||
      !data.nombre ||
      !data.apellido ||
      !data.correo ||
      !data.password
    ) {
      throw new Error('Faltan datos obligatorios para crear el usuario');
    }
    return await prisma.usuarios.create({
      data,
    });
  },

  // Función para actualizar un usuario
  async updateUsuario(id, data) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.usuarios.update({
      where: { id },
      data,
    });
  },

  // Función para eliminar un usuario
  async deleteUsuario(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.usuarios.delete({
      where: { id },
    });
  },


  // Función para obtener usuario por correo
  async getUsuarioByCorreo(correo) {
    return await prisma.usuarios.findUnique({
      where: { correo },
    });
  },


  // Función para actualizar la contraseña por correo
  async updatePasswordByCorreo(correo, nuevaPassword) {
    return await prisma.usuarios.update({
      where: { correo },
      data: { password: nuevaPassword },
    });
  },

};
