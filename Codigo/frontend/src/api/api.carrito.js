import api from "./api.config";

export const CarritoService = {
  // Obtener el carrito por usuario
  async obtenerCarrito(usuarioId) {
    try {
      const response = await api.get(`/carrito/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  },

  // Agregar un producto al carrito
  async agregarProducto(usuarioId, productoId, cantidad) {
    try {
      const response = await api.post(`/carrito/${usuarioId}`, [
        { productoId, cantidad },
      ]);
      return response.data;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  },

  // Actualizar un producto en el carrito
  async actualizarProducto(usuarioId, productoId, cantidad) {
    try {
      const response = await api.put(`/carrito/${usuarioId}`, {
        productoId,
        cantidad,
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el producto en el carrito:", error);
      throw error;
    }
  },

  // Eliminar un producto del carrito
  async eliminarProducto(usuarioId, productoId) {
    try {
      const response = await api.delete(`/carrito/${usuarioId}/${productoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      throw error;
    }
  },

  // Vaciar el carrito
  async vaciarCarrito(usuarioId) {
    try {
      const response = await api.delete(`/carrito/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      throw error;
    }
  },
};
