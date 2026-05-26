

// Replace with your backend URL
// For local testing: Use your computer's IP address, not localhost
// Example: http://192.168.1.100:5000/api http://192.168.1.72:5000/api http://localhost:8081/api
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ REPLACE WITH YOUR COMPUTER'S IP ADDRESS
// Example: http://192.168.1.100:5000/api http://192.168.1.72:5000/api http://localhost:8081/api
const API_BASE_URL = 'http://localhost:8081/api';

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