const { body } = require('express-validator');

const validarPedido = [
  body('usuarioId')
    .notEmpty().withMessage('El ID del usuario es obligatorio.')
    .isInt().withMessage('El ID del usuario debe ser un número entero válido.'),
  body('total')
    .notEmpty().withMessage('El total es obligatorio.')
    .isFloat({ gt: 0 }).withMessage('El total debe ser un valor mayor a 0.'),
  body('productos')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto.')
    .custom((productos) => {
      productos.forEach((producto) => {
        if (!producto.productoId || typeof producto.productoId !== 'number') {
          throw new Error('Cada producto debe tener un productoId válido.');
        }
        if (!producto.cantidad || producto.cantidad <= 0) {
          throw new Error('Cada producto debe tener una cantidad mayor a 0.');
        }
      });
      return true;
    }),
];

module.exports = { validarPedido };
