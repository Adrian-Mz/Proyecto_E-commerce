import api from './api.config';

export const UsuariosAPI = {
  getAllUsuarios: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getUsuarioById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  createUsuario: async (usuarioData) => {
    const response = await api.post('/usuarios', usuarioData);
    return response.data;
  },

  updateUsuario: async (id, usuarioData) => {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  deleteUsuario: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  getUsuarioByEmail: async (correo) => {
    const response = await api.get(`/usuarios/email/${correo}`);
    return response.data; // { exists: true/false }
  },
  loginUsuario: async (data) => {
    const response = await api.post('/usuarios/login', data);
    return response.data; // { success: true, usuario: {...} }
  },
};
