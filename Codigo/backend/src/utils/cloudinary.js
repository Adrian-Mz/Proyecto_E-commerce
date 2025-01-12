import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const subirImagenCloudinary = async (filePath, carpeta = 'productos') => {
  try {
    console.log('Subiendo imagen a Cloudinary...');
    const result = await cloudinary.uploader.upload(filePath, { folder: carpeta });
    console.log('Imagen subida exitosamente:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(`Error al subir la imagen a Cloudinary: ${error.message}`);
    throw new Error('Error al subir la imagen a Cloudinary');
  }
};

