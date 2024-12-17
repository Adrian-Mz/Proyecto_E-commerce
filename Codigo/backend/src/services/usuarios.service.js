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

  async createUsuario(data) {
    console.log("Fecha recibida en el backend (sin procesar):", data.fechaNacimiento);
  
    // Validaciones básicas para los datos de usuario
    if (!data || !data.nombre || !data.correo || !data.password) {
      throw new Error('Datos incompletos para crear el usuario');
    }

    // Validar si el correo ya está registrado
    const usuarioExistente = await UsuariosData.getUsuarioByCorreo(data.correo);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado. Utilice otro correo.');
    }
  
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
  
    // Convertir fechaNacimiento a un objeto Date si viene como "YYYY-MM-DD"
    if (data.fechaNacimiento) {
      const fechaValida = new Date(data.fechaNacimiento); // JavaScript convierte YYYY-MM-DD a un objeto Date
      if (isNaN(fechaValida.getTime())) {
        throw new Error('La fecha proporcionada no es válida');
      }
      console.log("Fecha convertida a Date:", fechaValida);
      data.fechaNacimiento = fechaValida; // Prisma acepta objetos Date
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

    // Validar y convertir fechaNacimiento si está presente
    if (data.fechaNacimiento) {
      const isValidDate = /^\d{2}\/\d{2}\/\d{4}$/.test(data.fechaNacimiento);
      if (!isValidDate) {
        throw new Error('El formato de fecha debe ser DD/MM/YYYY');
      }

      const [dia, mes, anio] = data.fechaNacimiento.split('/');
      const fechaISO = `${anio}-${mes}-${dia}T00:00:00.000Z`;

      const fechaValida = new Date(fechaISO);
      if (isNaN(fechaValida.getTime())) {
        throw new Error('La fecha proporcionada no es válida');
      }

      data.fechaNacimiento = fechaISO; // Guardar en formato ISO-8601
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
