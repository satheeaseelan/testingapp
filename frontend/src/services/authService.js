import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    // Optional: Call backend logout endpoint if needed
    // await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};
