import { body, param } from 'express-validator';

// Validaciones para crear una nueva promoción
export const validarCrearPromocion = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la promoción es obligatorio.')
    .isString().withMessage('El nombre debe ser un texto.'),
  body('descripcion')
    .notEmpty().withMessage('La descripción de la promoción es obligatoria.')
    .isString().withMessage('La descripción debe ser un texto.'),
  body('descuento')
    .notEmpty().withMessage('El descuento es obligatorio.')
    .isFloat({ min: 1, max: 100 }).withMessage('El descuento debe estar entre 1 y 100.'),
  body('fechaInicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria.')
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida en formato ISO 8601.'),
  body('fechaFin')
    .notEmpty().withMessage('La fecha de fin es obligatoria.')
    .isISO8601().withMessage('La fecha de fin debe ser una fecha válida en formato ISO 8601.')
    .custom((value, { req }) => {
      const fechaInicio = new Date(req.body.fechaInicio);
      const fechaFin = new Date(value);
      if (fechaInicio > fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
      }
      return true;
    }),
];

// Validaciones para actualizar una promoción existente
export const validarActualizarPromocion = [
  param('promocionId')
    .notEmpty().withMessage('El ID de la promoción es obligatorio.')
    .isInt().withMessage('El ID de la promoción debe ser un número entero.'),
  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser un texto.'),
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser un texto.'),
  body('descuento')
    .optional()
    .isFloat({ min: 1, max: 100 }).withMessage('El descuento debe estar entre 1 y 100.'),
  body('fechaInicio')
    .optional()
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida en formato ISO 8601.'),
  body('fechaFin')
    .optional()
    .isISO8601().withMessage('La fecha de fin debe ser una fecha válida en formato ISO 8601.')
    .custom((value, { req }) => {
      if (req.body.fechaInicio) {
        const fechaInicio = new Date(req.body.fechaInicio);
        const fechaFin = new Date(value);
        if (fechaInicio > fechaFin) {
          throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
        }
      }
      return true;
    }),
  body('categorias')
    .optional()
    .isArray().withMessage("El campo 'categorias' debe ser un array.")
    .custom((categorias) => {
      if (!categorias.every(Number.isInteger)) {
        throw new Error("El campo 'categorias' debe contener solo números enteros.");
      }
      return true;
    }),
];

