import { UsuariosAPI } from '../api/api.usuarios';

export const UsuariosService = {
  async getUsuarios() {
    const usuarios = await UsuariosAPI.getAllUsuarios();
    return usuarios.map((usuario) => ({
      ...usuario,
      nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
    }));
  },
};
