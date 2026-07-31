import api from './api';

const authService = {
  // Set auth token for all requests
  setAuthToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Remove auth token
  removeAuthToken() {
    delete api.defaults.headers.common['Authorization'];
  },

  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Update profile
  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    return response.data.user;
  },

  // Change password
  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default authService;