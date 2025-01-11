import { body } from 'express-validator';

export const validarProducto = [
  // Validación para el nombre
  body('nombre')
    .notEmpty().withMessage('El nombre del producto es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),

  // Validación para la descripción
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria.')
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres.'),

  // Validación para el precio
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio.')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0.'),

  // Validación para el stock
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio.')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número mayor o igual a 0.'),

  // Validación para la categoría
  body('categoriaId')
    .notEmpty().withMessage('La categoría es obligatoria.')
    .isInt().withMessage('La categoría debe ser un ID válido.'),

  // Validación para la promoción
  body('promocionId')
    .notEmpty().withMessage('La promoción es obligatoria.')
    .isInt().withMessage('El ID de la promoción debe ser un número válido.'),

  // Validación para las especificaciones
  body('especificaciones')
    .notEmpty().withMessage('Las especificaciones son obligatorias.')
    .isLength({ max: 1000 }).withMessage('Las especificaciones no pueden exceder los 1000 caracteres.'),

  // Validación para la marca
  body('marca')
    .notEmpty().withMessage('La marca es obligatoria.')
    .isLength({ max: 100 }).withMessage('La marca no puede exceder los 100 caracteres.'),

  // Validación para la garantía
  body('garantia')
    .notEmpty().withMessage('La garantía es obligatoria.')
    .isLength({ max: 100 }).withMessage('La garantía no puede exceder los 100 caracteres.'),
];

export const validarProductoActualizar = [
  body('nombre')
    .optional() // Hace que este campo sea opcional
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser una cadena de texto.'),
  body('precio')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0.'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número mayor o igual a 0.'),
  body('categoriaId')
    .optional()
    .isInt({ min: 1 }).withMessage('La categoría debe ser un ID válido.'),
  body('promocionId')
    .optional()
    .isInt({ min: 1 }).withMessage('La promoción debe ser un ID válido.'),
];

