import { UsuariosAPI } from '../api/api.usuarios';

export const UsuariosService = {
  async getUsuarios() {
    const usuarios = await UsuariosAPI.getAllUsuarios();
    return usuarios.map((usuario) => ({
      ...usuario,
      nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
    }));
  },
  //Funcion crear usuario
  async createUsuario(usuarioData) {
    // Convertir fechaNacimiento a formato ISO 8601
    const usuarioDataFormatted = {
      ...usuarioData,
      fechaNacimiento: new Date(usuarioData.fechaNacimiento).toISOString(),
    };

    try {
      const response = await UsuariosAPI.createUsuario(usuarioDataFormatted);
      return {
        success: true,
        message: "¡Usuario registrado exitosamente!",
        usuario: response,
      };
    } catch (error) {
      console.error("Error en createUsuario:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar el usuario.",
      };
    }
  },
};

