import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3200/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
});

export default api;
