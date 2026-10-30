import api from './api.js';

export const trainingService = {
  getAllTrainings: async (params = {}) => {
    const res = await api.get('/trainings', { params });
    return res.data;
  },

  getTrainingById: async (id) => {
    const res = await api.get(`/trainings/${id}`);
    return res.data;
  },

  enroll: async (id) => {
    const res = await api.post(`/trainings/${id}/enroll`);
    return res.data;
  },

  createTraining: async (data) => {
    const res = await api.post('/trainings', data);
    return res.data;
  },

  updateTraining: async (id, data) => {
    const res = await api.put(`/trainings/${id}`, data);
    return res.data;
  },

  deleteTraining: async (id) => {
    const res = await api.delete(`/trainings/${id}`);
    return res.data;
  },
};

export const eventService = {
  getAllEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data;
  },

  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },

  register: async (id) => {
    const res = await api.post(`/events/${id}/register`);
    return res.data;
  },

  createEvent: async (data) => {
    const res = await api.post('/events', data);
    return res.data;
  },

  updateEvent: async (id, data) => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },

  deleteEvent: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};

export const announcementService = {
  getAllAnnouncements: async (params = {}) => {
    const res = await api.get('/announcements', { params });
    return res.data;
  },

  createAnnouncement: async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  updateAnnouncement: async (id, data) => {
    const res = await api.put(`/announcements/${id}`, data);
    return res.data;
  },

  deleteAnnouncement: async (id) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },
};
