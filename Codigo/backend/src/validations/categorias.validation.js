import { body } from 'express-validator';

export const validarCategoria = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la categoría es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
];
