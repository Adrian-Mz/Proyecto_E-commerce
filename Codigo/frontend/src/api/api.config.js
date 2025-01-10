import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3200/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Interceptor para agregar el token
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api;
