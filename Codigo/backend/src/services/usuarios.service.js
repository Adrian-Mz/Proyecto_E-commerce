import { UsuariosData } from '../data/usuarios.data.js';
import { enviarCorreo } from '../utils/emailService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const UsuariosService = {
  // Recupera todos los usuarios desde la base de datos
  async getAllUsuarios() {
    return await UsuariosData.getAllUsuarios();
  },

  // Obtiene un usuario específico por su ID
  async getUsuarioById(id) {
    console.log('ID recibido en UsuariosService.getUsuarioById:', id); // Verifica el ID recibido
    if (!Number.isInteger(id)) {
      console.log('El ID no es válido en UsuariosService.getUsuarioById');
      throw new Error('El ID debe ser un número válido.');
    }
  
    // Delegar la consulta a UsuariosData
    const usuario = await UsuariosData.getUsuarioById(id);
    console.log('Resultado de UsuariosData.getUsuarioById:', usuario); // Verifica el resultado
    return usuario;
  },  

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
    const usuarioCreado = await UsuariosData.createUsuario(nuevoUsuarioData);
  
    // Crear el mensaje de bienvenida
    const mensaje = `
      <h1>Bienvenido a Tu App</h1>
      <p>Hola ${nombre},</p>
      <p>Gracias por registrarte en nuestra plataforma. Ya puedes iniciar sesión con tu correo electrónico y disfrutar de nuestros servicios.</p>
      <p>Saludos cordiales,</p>
      <p>El equipo de Tu App</p>
    `;
  
    // Enviar notificación por correo
    try {
      await enviarCorreo(correo, '¡Bienvenido a Tu App!', mensaje);
      console.log(`Correo de bienvenida enviado a ${correo}`);
    } catch (error) {
      console.error(`Error al enviar el correo de bienvenida a ${correo}:`, error.message);
      // El registro del usuario ya está completo, así que no lanzamos un error aquí.
    }
  
    return usuarioCreado;
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
        id: Number(usuario.id),
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
    console.log('Correo recibido para recuperar contraseña:', correo);
    const usuario = await UsuariosData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error('No existe un usuario registrado con ese correo.');
    }

    // Generar nueva contraseña temporal
    const nuevaPassword = this.generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar la contraseña en la base de datos
    await UsuariosData.updatePasswordByCorreo(correo, hashedPassword);

    // Crear el mensaje de correo
    const mensaje = `
      <h1>Recuperación de Contraseña</h1>
      <p>Hola ${usuario.nombre},</p>
      <p>Tu nueva contraseña temporal es:</p>
      <h2>${nuevaPassword}</h2>
      <p>Por favor, cámbiala después de iniciar sesión.</p>
      <p>Saludos,</p>
      <p>El equipo de Tu App</p>
    `;

    // Enviar el correo
    try {
      await enviarCorreo(correo, 'Recuperación de Contraseña', mensaje);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo. Por favor, inténtalo de nuevo más tarde.');
    }
    return 'Se ha enviado una contraseña temporal a tu correo electrónico.';
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
