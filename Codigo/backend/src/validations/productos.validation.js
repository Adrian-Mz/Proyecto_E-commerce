import { body } from 'express-validator';

export const validarProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre del producto es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  body('descripcion')
    .optional()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres.'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio.')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0.'),
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio.')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número mayor o igual a 0.'),
  body('categoriaId')
    .notEmpty().withMessage('La categoría es obligatoria.')
    .isInt().withMessage('La categoría debe ser un ID válido.'),
];

