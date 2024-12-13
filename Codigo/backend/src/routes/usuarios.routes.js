import express from 'express';
import { UsuariosService } from '../services/usuarios.service.js';
import { validarUsuario } from '../validations/usuarios.validation.js'
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware para manejar los errores de validación
const handleValidation = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

//Trare a todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await UsuariosService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Trare a los usuarios por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await UsuariosService.getUsuarioById(id);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



//Crea un usuario
router.post('/', validarUsuario, handleValidation, async (req, res) => {
  try {
    const usuario = await UsuariosService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Aplicar validaciones al actualizar un usuario
router.put('/:id', validarUsuario, handleValidation, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await UsuariosService.updateUsuario(id, req.body);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await UsuariosService.deleteUsuario(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const usuario = await UsuariosService.loginUsuario(req.body);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});


export default router;
