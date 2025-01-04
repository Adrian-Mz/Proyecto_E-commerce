import express from 'express';
import { UsuariosService } from '../services/usuarios.service.js';
import { validarUsuario } from '../validations/usuarios.validation.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware para manejar los errores de validación y devolverlos al cliente
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Ruta para obtener todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await UsuariosService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener un usuario específico por su ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await UsuariosService.getUsuarioById(id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear un nuevo usuario con validaciones
router.post('/', validarUsuario, handleValidation, async (req, res, next) => {
  try {
    const nuevoUsuario = await UsuariosService.createUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un usuario existente
router.put('/:id', validarUsuario, handleValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await UsuariosService.updateUsuario(id, req.body);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar un usuario existente por su ID
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await UsuariosService.deleteUsuario(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Ruta para realizar el inicio de sesión
router.post('/login', async (req, res, next) => {
  try {
    const usuario = await UsuariosService.loginUsuario(req.body);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
});

// Ruta para recuperar la contraseña del usuario
router.post('/recuperar', async (req, res, next) => {
  try {
    const { correo } = req.body;
    const resultado = await UsuariosService.recuperarPassword(correo);
    res.status(200).json({ message: resultado });
  } catch (error) {
    next(error);
  }
});

// Ruta para cambiar la contraseña del usuario
router.post('/cambiar-password', async (req, res, next) => {
  try {
    const { correo, passwordTemporal, nuevaPassword } = req.body;
    const mensaje = await UsuariosService.cambiarPassword(correo, passwordTemporal, nuevaPassword);
    res.status(200).json({ message: mensaje });
  } catch (error) {
    next(error);
  }
});

export default router;
