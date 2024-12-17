import { body } from 'express-validator';

export const validarPedido = [
  body('direccionEnvio')
    .notEmpty()
    .withMessage('La dirección de envío es obligatoria.'),
  body('metodoPago')
    .isIn(['tarjeta', 'paypal', 'transferencia'])
    .withMessage('El método de pago no es válido.'),
];
