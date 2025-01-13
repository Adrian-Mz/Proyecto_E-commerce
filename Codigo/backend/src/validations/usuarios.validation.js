import { body } from 'express-validator';

// Lista de dominios permitidos
const dominiosPermitidos = ['gmail.com','hotmail.com', 'yahoo.com']; // En el futuro, puedes agregar más dominios a esta lista.

export const validarUsuario = [
  // Valida que el nombre sea obligatorio y tenga al menos 2 caracteres
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),

  // Valida que el correo sea obligatorio, esté en un formato válido y tenga un dominio permitido
  body('correo')
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Debe ser un email válido.')
    .custom((value) => {
      const dominio = value.split('@')[1]; // Obtiene el dominio del correo
      if (!dominiosPermitidos.includes(dominio)) {
        throw new Error(`Solo se permiten correos de los siguientes dominios: ${dominiosPermitidos.join(', ')}`);
      }
      return true;
    }),

  // Valida que la contraseña sea obligatoria y tenga al menos 8 caracteres
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula.')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número.')
    .matches(/[@$!%*?&]/).withMessage('La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &).'),

  // Valida que el teléfono sea opcional pero, si se envía, debe ser numérico
  body('telefono')
    .optional()
    .isNumeric().withMessage('El teléfono debe ser un número válido.'),

  // Valida que la fecha de nacimiento esté en un formato específico (opcional)
  body('fechaNacimiento')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('La fecha de nacimiento debe estar en formato YYYY-MM-DD.')
    .isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida.')
];
