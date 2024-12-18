import express from 'express';
import { metodoPagoService } from '../services/metodo_pago.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const metodos = await metodoPagoService.obtenerMetodosPago();
    res.status(200).json(metodos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener métodos de pago.' });
  }
});

export default router;
