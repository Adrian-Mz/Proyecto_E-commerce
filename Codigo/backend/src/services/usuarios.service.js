import { UsuariosData } from '../data/usuarios.data.js';
import bcrypt from 'bcrypt'; 

export const UsuariosService = {

  // Recupera todos los usuarios desde la base de datos.
  async getAllUsuarios() {
    return await UsuariosData.getAllUsuarios();
  },

  // Obtiene un usuario específico mediante su ID, validando su existencia.
  async getUsuarioById(id) {
    if (typeof id !== 'number') {
      throw new Error('ID debe ser un número');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  },


  // Crea un nuevo usuario en la base de datos después de validar los datos proporcionados.
  async createUsuario(data) {
    // Validaciones básicas para los datos de usuario
    if (!data || !data.nombre || !data.correo || !data.password) {
      throw new Error('Datos incompletos para crear el usuario');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10); // 10 es el costo del hash
    data.password = hashedPassword;

    // Convertir fechaNacimiento al formato ISO si está presente
    if (data.fechaNacimiento) {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(data.fechaNacimiento);
      if (!isValidDate) {
        throw new Error('El formato de fecha debe ser YYYY-MM-DD');
      }
      data.fechaNacimiento = new Date(`${data.fechaNacimiento}T00:00:00.000Z`);
    }

    // Guardar el usuario en la base de datos
    return await UsuariosData.createUsuario(data);
  },



  // Actualiza los datos de un usuario existente en la base de datos, validando que el usuario exista.
  async updateUsuario(id, data) {
    if (typeof id !== 'number') {
      throw new Error('ID debe ser un número');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await UsuariosData.updateUsuario(id, data);
  },


   // Elimina un usuario existente de la base de datos después de validar que el usuario existe.
  async deleteUsuario(id) {
    if (typeof id !== 'number') {
      throw new Error('ID debe ser un número');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await UsuariosData.deleteUsuario(id);
  },



  // Realiza el inicio de sesión verificando las credenciales del usuario y devolviendo sus datos si son correctos.
  async loginUsuario(data) {
    const { correo, password } = data;

    if (!correo || !password) {
      throw new Error('Correo y contraseña son obligatorios');
    }

    // Buscar el usuario por correo
    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // Devolver los datos del usuario (sin la contraseña)
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  },
};
