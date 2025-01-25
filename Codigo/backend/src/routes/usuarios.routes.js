import express from 'express';
import { UsuariosService } from '../services/usuarios.service.js';
import { validarUsuario, validarActualizacionPerfil } from '../validations/usuarios.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';
import { registrarAccion } from '../middlewares/auditoria.middleware.js';
import { handleValidation } from '../middlewares/handleValidation.js';

const router = express.Router();

// Ruta para obtener los datos del usuario autenticado
router.get(
  '/mi-perfil',
  verificarToken,
  async (req, res, next) => {
    try {
      console.log('Usuario autenticado en /mi-perfil:', req.usuario);

      const id = req.usuario.id; // Extraer el ID
      console.log('ID extraído del token:', id, 'Tipo:', typeof id); // Verificar tipo y valor del ID

      if (!Number.isInteger(id)) {
        console.log('El ID no es un número entero:', id);
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
      }

      const usuario = await UsuariosService.getUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.log('Error en la ruta /mi-perfil:', error.message);
      next(error);
    }
  }
);

// Ruta para obtener todos los usuarios (protegida, solo Administradores)
router.get(
  '/',
  verificarToken, // Verifica si el usuario está autenticado
  verificarRol(['Administrador']), // Solo los administradores pueden acceder
  async (req, res, next) => {
    try {
      const usuarios = await UsuariosService.getAllUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para obtener un usuario específico por su ID (protegida, Administradores)
router.get(
  '/:id',
  verificarToken, // Verifica autenticación
  verificarRol(['Administrador', 'Cliente']), // Permite roles específicos
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);

      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
      }

      // Lógica específica para el rol "Cliente"
      if (req.usuario.rol === 'Cliente') {
        if (req.usuario.id !== id) {
          return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso.' });
        }
      }

      // Si es administrador o el cliente cumple la validación, continuar
      const usuario = await UsuariosService.getUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para crear un nuevo usuario (registro abierto, no requiere autenticación)
router.post('/', validarUsuario, handleValidation, async (req, res, next) => {
  try {
    const nuevoUsuario = await UsuariosService.createUsuario(req.body);
    res.status(201).json({ mensaje: 'Usuario creado exitosamente.', usuario: nuevoUsuario });
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un usuario existente (protegida, Administradores y Clientes)
router.put(
  '/:id',
  verificarToken, // Verifica si el usuario está autenticado
  validarActualizacionPerfil,
  handleValidation,
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
      }

      // Verifica si el usuario tiene permisos para actualizar este recurso
      if (req.usuario.rol === 'Cliente' && req.usuario.id !== id) {
        return res.status(403).json({ error: 'No tienes permisos para modificar este recurso.' });
      }

      // Validar los datos antes de la actualización
      const datosActualizados = req.body;

      const usuarioActualizado = await UsuariosService.updateUsuario(id, datosActualizados);
      res.status(200).json({ mensaje: 'Usuario actualizado exitosamente.', usuario: usuarioActualizado });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para eliminar un usuario existente por su ID (protegida, Administradores)
router.delete(
  '/:id',
  verificarToken,
  verificarRol(['Administrador']),
  registrarAccion('usuarios', 'eliminación'), // Registra la acción en la auditoría
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
      }
      // Verifica si el administrador intenta autoeliminarse
      if (req.usuario.id === id) {
        return res.status(403).json({ error: 'No puedes eliminar tu propia cuenta.' });
      }
      await UsuariosService.deleteUsuario(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para realizar el inicio de sesión (abierta)
router.post('/login', async (req, res, next) => {
  try {
    const usuario = await UsuariosService.loginUsuario(req.body);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
});

// Ruta para recuperar la contraseña del usuario (abierta)
router.post('/recuperar', async (req, res, next) => {
  try {
    const { correo } = req.body;

    if (!correo || typeof correo !== 'string' || !correo.trim()) {
      return res.status(400).json({ error: 'El campo "correo" es obligatorio y debe ser válido.' });
    }

    const resultado = await UsuariosService.recuperarPassword(correo.trim());
    res.status(200).json({ mensaje: resultado });
  } catch (error) {
    next(error);
  }
});

// Cambio de Contraseña desde el Perfil del Usuario
router.post(
  "/cambiar-password-perfil",
  verificarToken,
  async (req, res, next) => {
    try {
      const { passwordActual, nuevaPassword } = req.body;
      const correo = req.usuario.correo; // Extraer correo desde el token

      if (!correo || !passwordActual || !nuevaPassword) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      const mensaje = await UsuariosService.cambiarPasswordPerfil(correo, passwordActual, nuevaPassword);
      res.status(200).json({ mensaje });
    } catch (error) {
      next(error);
    }
  }
);




// Ruta para cambiar la contraseña del usuario (protegida, acceso del propio usuario)
router.post(
  '/cambiar-password-temporal',
  async (req, res, next) => {
    try {
      const { correo, passwordTemporal, nuevaPassword } = req.body;

      if (!correo || !passwordTemporal || !nuevaPassword) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      const mensaje = await UsuariosService.cambiarPasswordTemporal(correo, passwordTemporal, nuevaPassword);
      res.status(200).json({ mensaje });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
