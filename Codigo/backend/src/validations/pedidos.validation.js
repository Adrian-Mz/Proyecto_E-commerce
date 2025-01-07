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
  body('detallesPago.numeroTarjeta')
    .notEmpty().withMessage('El número de tarjeta es obligatorio.')
    .isLength({ min: 16, max: 16 }).withMessage('El número de tarjeta debe tener 16 dígitos.'),
  body('detallesPago.nombreTitular')
    .notEmpty().withMessage('El nombre del titular es obligatorio.')
    .isString().withMessage('El nombre del titular debe ser texto.'),
  body('detallesPago.fechaExpiracion')
    .notEmpty().withMessage('La fecha de expiración es obligatoria.')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('La fecha de expiración debe estar en el formato MM/AA.'),
  body('detallesPago.correoContacto')
    .notEmpty().withMessage('El correo de contacto es obligatorio.')
    .isEmail().withMessage('Debe proporcionar un correo válido.'),
  body('detallesPago.telefonoContacto')
    .notEmpty().withMessage('El teléfono de contacto es obligatorio.')
    .isString().withMessage('El teléfono debe ser texto.'),
];

export const validarActualizarEstado = [
  body('nuevoEstadoId')
    .notEmpty().withMessage('El nuevo estado es obligatorio.')
    .isInt().withMessage('El ID del estado debe ser un número.'),
];
