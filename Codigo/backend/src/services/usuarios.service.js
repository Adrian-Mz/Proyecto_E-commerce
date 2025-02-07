import { UsuariosData } from '../data/usuarios.data.js';
import { enviarCorreo } from '../utils/emailService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { auditoriaService } from '../services/auditoria.service.js'; // Importar servicio de auditoría

export const UsuariosService = {
  async getAllUsuarios() {
    return await UsuariosData.getAllUsuarios();
  },

  async getUsuarioById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    return usuario;
  },

  async createUsuario(data, usuarioId) {
    const { nombre, correo, apellido, password, direccion, telefono, ciudad, fechaNacimiento } = data;

    if (!nombre || !correo || !password) {
      throw new Error('Todos los campos obligatorios deben ser proporcionados.');
    }

    const usuarioExistente = await UsuariosData.getUsuarioByCorreo(correo);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rolUsuario = await UsuariosData.getRolPorId(2);
    if (!rolUsuario) {
      throw new Error('El rol por defecto no está configurado en la base de datos.');
    }

    const nuevoUsuarioData = {
      nombre,
      apellido,
      correo,
      password: hashedPassword,
      direccion,
      telefono,
      ciudad,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      rolId: rolUsuario.id,
    };

    const usuarioCreado = await UsuariosData.createUsuario(nuevoUsuarioData);

    // Registrar auditoría
    await auditoriaService.registrarEvento(usuarioId, "usuarios", "CREAR", usuarioCreado);

    const mensaje = `
      <h1>Bienvenido a Tu App</h1>
      <p>Hola ${nombre},</p>
      <p>Gracias por registrarte en nuestra plataforma. Ya puedes iniciar sesión con tu correo electrónico.</p>
      <p>Saludos,</p>
      <p>El equipo de Tu App</p>
    `;

    try {
      await enviarCorreo(correo, '¡Bienvenido a Tu App!', mensaje);
      console.log(`Correo de bienvenida enviado a ${correo}`);
    } catch (error) {
      console.error(`Error al enviar el correo de bienvenida a ${correo}:`, error.message);
    }

    return usuarioCreado;
  },

  async updateUsuario(id, data, usuarioId) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    if (data.fechaNacimiento) {
      const fecha = new Date(data.fechaNacimiento);
      if (isNaN(fecha.getTime())) {
        throw new Error('La fecha de nacimiento no es válida.');
      }
      data.fechaNacimiento = fecha;
    }

    const usuarioActualizado = await UsuariosData.updateUsuario(id, data);

    // Registrar auditoría solo de los datos que cambiaron
    const cambios = Object.keys(data).reduce((acc, key) => {
      if (usuario[key] !== data[key]) {
        acc[key] = { antes: usuario[key], despues: data[key] };
      }
      return acc;
    }, {});

    if (Object.keys(cambios).length > 0) {
      await auditoriaService.registrarEvento(usuarioId, "usuarios", "ACTUALIZAR", cambios);
    }

    return usuarioActualizado;
  },

  async deleteUsuario(id, usuarioId) {
    if (!Number.isInteger(id)) {
      throw new Error('El ID debe ser un número válido.');
    }

    const usuario = await UsuariosData.getUsuarioById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    await UsuariosData.deleteUsuario(id);

    // Registrar auditoría
    await auditoriaService.registrarEvento(usuarioId, "usuarios", "ELIMINAR", usuario);

    return { mensaje: 'Usuario eliminado exitosamente.' };
  },

  async loginUsuario({ correo, password }) {
    if (!correo || !password) {
      throw new Error('El correo y la contraseña son obligatorios.');
    }

    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas.');
    }

    const token = jwt.sign(
      {
        id: Number(usuario.id),
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...usuarioSinPassword } = usuario;
    
    // **Registrar auditoría del inicio de sesión**
    await auditoriaService.registrarEvento(usuario.id, "usuarios", "LOGIN", {
      usuarioId: usuario.id,
      correo: usuario.correo,
      fechaHora: new Date()
    });

    return { ...usuarioSinPassword, token };
  },

  async recuperarPassword(correo) {
    console.log('Correo recibido para recuperar contraseña:', correo);
    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('No existe un usuario registrado con ese correo.');
    }

    const nuevaPassword = this.generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await UsuariosData.updatePasswordByCorreo(correo, hashedPassword);

    const mensaje = `
      <h1>Recuperación de Contraseña</h1>
      <p>Hola ${usuario.nombre},</p>
      <p>Tu nueva contraseña temporal es:</p>
      <h2>${nuevaPassword}</h2>
      <p>Por favor, cámbiala después de iniciar sesión.</p>
      <p>Saludos,</p>
      <p>El equipo de Tu App</p>
    `;

    try {
      await enviarCorreo(correo, 'Recuperación de Contraseña', mensaje);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo. Inténtalo nuevamente más tarde.');
    }
    return 'Se ha enviado una contraseña temporal a tu correo electrónico.';
  },

  generarPasswordTemporal() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join('');
  },

  async cambiarPassword(correo, contrasenaActual, nuevaContrasena) {
    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('No existe un usuario registrado con ese correo.');
    }

    const esContrasenaValida = await bcrypt.compare(contrasenaActual, usuario.password);
    if (!esContrasenaValida) {
      throw new Error('La contraseña actual no es válida.');
    }

    const hashedNuevaContrasena = await bcrypt.hash(nuevaContrasena, 10);

    await UsuariosData.updatePasswordByCorreo(correo, hashedNuevaContrasena);

    return { mensaje: 'La contraseña se actualizó correctamente.' };
  },
};
