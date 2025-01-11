import express from 'express';
import { UsuariosService } from '../services/usuarios.service.js';
import { validarUsuario } from '../validations/usuarios.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';
import { registrarAccion } from '../middlewares/auditoria.middleware.js';
import { handleValidation } from '../middlewares/handleValidation.js';


const router = express.Router();

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
  verificarToken,
  verificarRol(['Administrador']),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const usuario = await UsuariosService.getUsuarioById(id);
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
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un usuario existente (protegida, Administradores)
router.put(
  '/:id',
  verificarToken,
  verificarRol(['Administrador']),
  validarUsuario,
  handleValidation,
  registrarAccion('usuarios', 'actualización'), // Registra la acción en la auditoría
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const usuario = await UsuariosService.updateUsuario(id, req.body);
      res.status(200).json(usuario);
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
    const resultado = await UsuariosService.recuperarPassword(correo);
    res.status(200).json({ message: resultado });
  } catch (error) {
    next(error);
  }
});

// Ruta para cambiar la contraseña del usuario (protegida, acceso del propio usuario)
router.post(
  '/cambiar-password',
  verificarToken, // El usuario debe estar autenticado
  registrarAccion('usuarios', 'cambio de contraseña'), // Registra la acción en la auditoría
  async (req, res, next) => {
    try {
      const { correo, passwordTemporal, nuevaPassword } = req.body;
      const mensaje = await UsuariosService.cambiarPassword(correo, passwordTemporal, nuevaPassword);
      res.status(200).json({ message: mensaje });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
