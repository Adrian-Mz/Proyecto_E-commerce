import { validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Formatea los errores en un array legible
    const formattedErrors = errors.array().map((err) => ({
      field: err.param, // Campo que falló
      message: err.msg, // Mensaje de error
    }));

    return res.status(400).json({
      errors: formattedErrors,
    });
  }
  next();
};
