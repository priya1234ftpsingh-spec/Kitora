import api from './api.js';

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },

  sendNotification: async (data) => {
    const res = await api.post('/notifications/send', data);
    return res.data;
  },
};

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
