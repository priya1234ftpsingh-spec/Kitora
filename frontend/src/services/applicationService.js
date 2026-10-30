import api from './api.js';

export const applicationService = {
  applyToDrive: async (driveId) => {
    const res = await api.post(`/applications/apply/${driveId}`);
    return res.data;
  },

  getMyApplications: async () => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  // TPO endpoints
  getAllApplications: async (params = {}) => {
    const res = await api.get('/applications', { params });
    return res.data;
  },

  updateStatus: async (id, data) => {
    const res = await api.put(`/applications/${id}/status`, data);
    return res.data;
  },
};
