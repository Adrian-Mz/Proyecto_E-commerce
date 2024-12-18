import express from 'express';
import { metodoEnvioService } from '../services/metodo_envio.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const metodos = await metodoEnvioService.obtenerMetodosEnvio();
    res.status(200).json(metodos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener métodos de envío.' });
  }
});

export default router;
