import api from './api.config';

export const RolesAPI = {
  // Obtener todos los roles
  getAllRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error.response?.data || error.message);
      throw error;
    }
  },

  // Asignar un rol a un usuario
  assignRoleToUser: async (usuarioId, rolId) => {
    try {
      const response = await api.put('/roles/asignar', { usuarioId, rolId });
      return response.data;
    } catch (error) {
      console.error('Error al asignar rol:', error.response?.data || error.message);
      throw error;
    }
  },
};
