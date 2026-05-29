

// Laravel backend running on http://127.0.0.1:8000/api
// For mobile device testing, replace localhost with your computer's IP address
// Example: http://192.168.1.100:8000/api
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ For local testing on web: http://127.0.0.1:8000/api
// ⚠️ For mobile device: Replace 127.0.0.1 with your computer's IP address
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const courtsAPI = {
  getAll: () => api.get('/courts'),
  getById: (id: number) => api.get(`/courts/${id}`),
};

export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  create: (data: any) => api.post('/bookings', data),
  cancel: (id: number) => api.delete(`/bookings/${id}`),
};

export const teamsAPI = {
  getAll: () => api.get('/teams'),
  join: (id: number) => api.post(`/teams/${id}/join`),
};

export const offersAPI = {
  getAll: () => api.get('/offers'),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (court_id: number) => api.post('/favorites', { court_id }),
  remove: (court_id: number) => api.delete(`/favorites/${court_id}`),
};

export default api;