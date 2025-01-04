import { body } from 'express-validator';

export const validarCrearPedido = [
  body('direccionEnvio')
    .notEmpty().withMessage('La dirección de envío es obligatoria.')
    .isString().withMessage('La dirección de envío debe ser texto.'),
  body('metodoPagoId')
    .notEmpty().withMessage('El método de pago es obligatorio.')
    .isInt().withMessage('El método de pago debe ser un ID válido.'),
  body('metodoEnvioId')
    .notEmpty().withMessage('El método de envío es obligatorio.')
    .isInt().withMessage('El método de envío debe ser un ID válido.'),
  body('productos')
    .optional()
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto.')
    .custom((productos) => {
      productos.forEach((p) => {
        if (!p.productoId || !p.cantidad || !p.precio_unitario) {
          throw new Error('Cada producto debe tener productoId, cantidad y precio_unitario.');
        }
      });
      return true;
    }),
];

export const validarActualizarEstado = [
  body('nuevoEstadoId')
    .notEmpty().withMessage('El nuevo estado es obligatorio.')
    .isInt().withMessage('El ID del estado debe ser un número.'),
];

