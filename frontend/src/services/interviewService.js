import api from './api.js';

export const interviewService = {
  getMyInterviews: async () => {
    const res = await api.get('/interviews/my');
    return res.data;
  },

  // TPO endpoints
  getAllInterviews: async (params = {}) => {
    const res = await api.get('/interviews', { params });
    return res.data;
  },

  scheduleInterview: async (data) => {
    const res = await api.post('/interviews', data);
    return res.data;
  },

  updateInterview: async (id, data) => {
    const res = await api.put(`/interviews/${id}`, data);
    return res.data;
  },

  deleteInterview: async (id) => {
    const res = await api.delete(`/interviews/${id}`);
    return res.data;
  },
};
