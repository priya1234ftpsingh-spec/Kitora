import api from './api.js';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  getReportsData: async () => {
    const res = await api.get('/analytics/reports');
    return res.data;
  },
};
