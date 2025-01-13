import express from 'express';
import { rolesService } from '../services/roles.service.js';
import { handleValidation } from '../middlewares/handleValidation.js';

const router = express.Router();

// Crear un nuevo rol
router.post(
  '/',
  handleValidation,
  async (req, res) => {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre del rol es obligatorio.' });
      }

      const nuevoRol = await rolesService.crearRol(nombre);
      res.status(201).json({ mensaje: 'Rol creado exitosamente.', rol: nuevoRol });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Obtener todos los roles
router.get(
  '/',
  async (req, res) => {
    try {
      const roles = await rolesService.obtenerRoles();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Asignar un rol a un usuario
router.put(
  '/asignar',
  handleValidation,
  async (req, res) => {
    try {
      const { usuarioId, rolId } = req.body;

      if (!usuarioId || !rolId) {
        return res.status(400).json({ error: 'El usuarioId y rolId son obligatorios.' });
      }

      const usuarioActualizado = await rolesService.asignarRol(usuarioId, rolId);
      res.status(200).json({ mensaje: 'Rol asignado correctamente.', usuario: usuarioActualizado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
