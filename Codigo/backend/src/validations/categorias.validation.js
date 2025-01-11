import { body } from 'express-validator';

// Validaciones para crear una categoría
export const validarCategoriaParaCrear = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la categoría es obligatorio.')
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  body('descripcion')
    .notEmpty().withMessage('La descripción de la categoría es obligatoria.')
    .isString().withMessage('La descripción debe ser una cadena de texto.'),
];

// Validaciones para actualizar una categoría
export const validarCategoriaParaActualizar = [
  body('nombre')
    .optional() // Campo opcional para actualizaciones parciales
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser una cadena de texto.'),
];
