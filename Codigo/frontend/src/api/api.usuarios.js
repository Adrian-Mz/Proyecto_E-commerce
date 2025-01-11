import api from './api.config';

export const UsuariosAPI = {
  getAllUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error.response?.data || error.message);
      throw error;
    }
  },

  getUsuarioById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  createUsuario: async (usuarioData) => {
    try {
      const response = await api.post('/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error.response?.data || error.message);
      throw error;
    }
  },

  updateUsuario: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getUsuarioByEmail: async (correo) => {
    try {
      const response = await api.get(`/usuarios/email/${correo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario con correo ${correo}:`, error.response?.data || error.message);
      throw error;
    }
  },

  loginUsuario: async (data) => {
    try {
      const response = await api.post('/usuarios/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Almacena el token en el localStorage
      }
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      throw error;
    }
  },

  logoutUsuario: () => {
    localStorage.removeItem('token');
    console.info('Usuario deslogueado.');
  },
};
