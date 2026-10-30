import api from './api.js';

export const studentService = {
  getMyProfile: async () => {
    const res = await api.get('/students/profile');
    return res.data;
  },

  updateMyProfile: async (profileData) => {
    const res = await api.put('/students/profile', profileData);
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await api.get('/students/dashboard-stats');
    return res.data;
  },

  // TPO endpoints
  getAllStudents: async (params = {}) => {
    const res = await api.get('/students', { params });
    return res.data;
  },

  getStudentById: async (id) => {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },

  updatePlacementStatus: async (id, data) => {
    const res = await api.put(`/students/${id}/status`, data);
    return res.data;
  },
};
