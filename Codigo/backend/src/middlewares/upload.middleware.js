import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegúrate de que la carpeta temporal exista
const tempDir = path.join('src', 'uploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configuración para guardar archivos temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Carpeta temporal
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único
  },
});

// Validación de tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG, JPG.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
});
