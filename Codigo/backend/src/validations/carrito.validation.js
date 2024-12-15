import { body, param } from 'express-validator';

export const validarCarrito = {
  // Validar obtener carrito
  obtenerCarrito: [
    param('usuarioId')
      .isInt().withMessage('El usuarioId debe ser un número entero.')
  ],

  // Validar añadir producto al carrito
  agregarProducto: [
    param('usuarioId')
      .isInt().withMessage('El usuarioId debe ser un número entero.'),
    body('productoId')
      .isInt().withMessage('El productoId debe ser un número entero.'),
    body('cantidad')
      .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0.')
  ],

  // Validar actualizar cantidad de producto en el carrito
  actualizarProducto: [
    param('usuarioId')
      .isInt().withMessage('El usuarioId debe ser un número entero.'),

    body('productoId')
      .isInt().withMessage('El productoId debe ser un número entero.'),

      body('cantidad')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser mayor a 0.'),    
  ]
};
