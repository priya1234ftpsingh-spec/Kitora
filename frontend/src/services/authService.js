import api from './api.js';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  registerStudent: async (studentData) => {
    const res = await api.post('/auth/register-student', studentData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updatePassword: async (passwords) => {
    const res = await api.put('/auth/update-password', passwords);
    return res.data;
  },
};
