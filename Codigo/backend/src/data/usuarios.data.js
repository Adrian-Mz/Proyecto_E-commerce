import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UsuariosData = {
  // Obtiene todos los usuarios desde la base de datos
  async getAllUsuarios() {
    return await prisma.usuarios.findMany({
      orderBy: { id: 'asc' }, // Orden ascendente por ID
      include: { rol: true }, // Incluye los datos del rol
    });
  },

  // Obtener un rol por su nombre
  async getRolPorNombre(nombreRol) {
    if (!nombreRol) {
      throw new Error('El nombre del rol es obligatorio.');
    }
    return await prisma.roles.findUnique({
      where: { nombre: nombreRol },
    });
  },

  // Obtener un rol por su ID
  async getRolPorId(id) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID del rol debe ser un número válido.');
    }
    return await prisma.roles.findUnique({
      where: { id },
    });
  },

  // Obtiene un usuario específico por su ID
  async getUsuarioById(id) {
    console.log('ID recibido en UsuariosData.getUsuarioById:', id); // Verifica el ID recibido
    const usuario = await prisma.usuarios.findUnique({
      where: { id },
      include: { rol: true }, // Incluye los datos del rol
    });
    console.log('Resultado de la consulta en la base de datos:', usuario); // Muestra el resultado
    return usuario;
  },  

  // Crea un nuevo usuario en la base de datos
  async createUsuario(data) {
    if (!data || !data.nombre || !data.correo || !data.password || !data.rolId) {
      throw new Error('Faltan datos obligatorios para crear el usuario.');
    }
    return await prisma.usuarios.create({
      data,
      include: { rol: true }, // Incluye los datos del rol en la respuesta
    });
  },

  // Actualiza un usuario existente en la base de datos
  async updateUsuario(id, data) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }
    return await prisma.usuarios.update({
      where: { id },
      data,
      include: { rol: true }, // Incluye los datos del rol en la respuesta
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
    if (!correo) {
      throw new Error('El correo es obligatorio.');
    }
    return await prisma.usuarios.findUnique({
      where: { correo },
      include: { rol: true }, // Incluye los datos del rol
    });
  },

  // Actualiza la contraseña de un usuario por su correo
  async updatePasswordByCorreo(correo, nuevaPassword) {
    if (!correo || !nuevaPassword) {
      throw new Error('El correo y la nueva contraseña son obligatorios.');
    }
    return await prisma.usuarios.update({
      where: { correo },
      data: { password: nuevaPassword },
    });
  },
};
