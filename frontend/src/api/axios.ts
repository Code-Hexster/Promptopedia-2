import axios from 'axios';

const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL,
    withCredentials: true
});

export default api;
