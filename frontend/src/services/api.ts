import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { storage } from './storage';

const API_PORT = 8090;

function resolveApiHost(): string {
  try {
    const hostUri = (Constants as any).expoConfig?.hostUri as string | undefined;
    if (hostUri) {
      return hostUri.split(':')[0];
    }
  } catch (error) {
    // ignore and fall back
  }
  return Platform.OS === 'web' ? 'localhost' : 'localhost';
}

export const API_BASE_URL = `http://${resolveApiHost()}:${API_PORT}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('authToken');
    if (token) {
      if (config.headers && typeof (config.headers as any).set === 'function') {
        (config.headers as any).set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
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
