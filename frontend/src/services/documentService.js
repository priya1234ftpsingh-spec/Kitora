import api from './api.js';

export const documentService = {
  getMyDocuments: async () => {
    const res = await api.get('/documents/my');
    return res.data;
  },

  uploadDocument: async (formData) => {
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteDocument: async (id) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },

  // TPO endpoints
  getAllDocuments: async (params = {}) => {
    const res = await api.get('/documents', { params });
    return res.data;
  },

  verifyDocument: async (id, data) => {
    const res = await api.put(`/documents/${id}/verify`, data);
    return res.data;
  },
};
