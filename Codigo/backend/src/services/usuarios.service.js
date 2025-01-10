import { UsuariosData } from '../data/usuarios.data.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const UsuariosService = {
  // Recupera todos los usuarios desde la base de datos
  async getAllUsuarios() {
    return await UsuariosData.getAllUsuarios();
  },

  // Obtiene un usuario específico por su ID
  async getUsuarioById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }
    return usuario;
  },

  // Crea un nuevo usuario con validaciones y encriptación de contraseña
  async createUsuario(data) {
    const { nombre, correo, apellido, password, direccion, telefono, pais, fechaNacimiento } = data;

    if (!nombre || !correo || !password) {
      throw new Error('Todos los campos obligatorios deben ser proporcionados.');
    }

    const usuarioExistente = await UsuariosData.getUsuarioByCorreo(correo);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado.');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtener el rol por defecto (usuario)
    const rolUsuario = await UsuariosData.getRolPorId(2); // Nuevo método en UsuariosData
    if (!rolUsuario) {
      throw new Error('El rol por defecto no está configurado en la base de datos.');
    }

    // Preparar los datos del usuario
    const nuevoUsuarioData = {
      nombre,
      apellido,
      correo,
      password: hashedPassword,
      direccion,
      telefono,
      pais,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      rolId: rolUsuario.id, // Asignar el rol automáticamente
    };

    // Crear el usuario
    return await UsuariosData.createUsuario(nuevoUsuarioData);
  },

  // Actualiza los datos de un usuario existente
  async updateUsuario(id, data) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    // Validación nativa para fecha de nacimiento
    if (data.fechaNacimiento) {
      const fecha = new Date(data.fechaNacimiento);
      if (isNaN(fecha.getTime())) {
        throw new Error('La fecha de nacimiento no es válida.');
      }
      data.fechaNacimiento = fecha;
    }

    return await UsuariosData.updateUsuario(id, data);
  },

  // Elimina un usuario existente de la base de datos
  async deleteUsuario(id) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    return await UsuariosData.deleteUsuario(id);
  },

  // Realiza el inicio de sesión validando credenciales
  async loginUsuario({ correo, password }) {
    if (!correo || !password) {
      throw new Error('El correo y la contraseña son obligatorios.');
    }

    // Obtener usuario junto con el rol
    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas.');
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol.nombre, // Asegúrate de incluir el rol en la consulta de `getUsuarioByCorreo`
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token válido por 1 hora
    );

    const { password: _, ...usuarioSinPassword } = usuario;
    return {...usuarioSinPassword, token};
  },

  // Genera una nueva contraseña temporal y la actualiza
  async recuperarPassword(correo) {
    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('No existe un usuario registrado con ese correo.');
    }

    const nuevaPassword = this.generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await UsuariosData.updatePasswordByCorreo(correo, hashedPassword);

    return `Tu nueva contraseña temporal es: ${nuevaPassword}`;
  },

  // Genera una contraseña aleatoria temporal
  generarPasswordTemporal() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join('');
  },

  // Cambia la contraseña del usuario tras verificar la temporal
  async cambiarPassword(correo, passwordTemporal, nuevaPassword) {
    if (!correo || !passwordTemporal || !nuevaPassword) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(passwordTemporal, usuario.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña temporal incorrecta.');
    }

    if (nuevaPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    await UsuariosData.updatePasswordByCorreo(correo, hashedPassword);

    return 'Contraseña actualizada correctamente.';
  },
};
