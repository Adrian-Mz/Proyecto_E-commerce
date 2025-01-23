import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3200/api',
  timeout: 5000,
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtiene el token almacenado en el localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Agrega el token al encabezado Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas del servidor
api.interceptors.response.use(
  (response) => {
    // Si el backend renueva el token, lo almacenamos
    const renewedToken = response.headers['x-renewed-token'];
    if (renewedToken) {
      localStorage.setItem('token', renewedToken); // Actualiza el token en el localStorage
      console.info('Token renovado automáticamente.');
    }
    return response; // Retorna la respuesta al cliente
  },
  (error) => {
    // Si la solicitud falla, lanza el error
    return Promise.reject(error);
  }
);

export default api;
