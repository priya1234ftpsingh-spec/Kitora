import api from './api.js';

export const driveService = {
  getAllDrives: async (params = {}) => {
    const res = await api.get('/drives', { params });
    return res.data;
  },

  getDriveById: async (id) => {
    const res = await api.get(`/drives/${id}`);
    return res.data;
  },

  // TPO endpoints
  createDrive: async (data) => {
    const res = await api.post('/drives', data);
    return res.data;
  },

  updateDrive: async (id, data) => {
    const res = await api.put(`/drives/${id}`, data);
    return res.data;
  },

  deleteDrive: async (id) => {
    const res = await api.delete(`/drives/${id}`);
    return res.data;
  },
};

export const companyService = {
  getAllCompanies: async (params = {}) => {
    const res = await api.get('/companies', { params });
    return res.data;
  },

  getCompanyById: async (id) => {
    const res = await api.get(`/companies/${id}`);
    return res.data;
  },

  createCompany: async (data) => {
    const res = await api.post('/companies', data);
    return res.data;
  },

  updateCompany: async (id, data) => {
    const res = await api.put(`/companies/${id}`, data);
    return res.data;
  },

  deleteCompany: async (id) => {
    const res = await api.delete(`/companies/${id}`);
    return res.data;
  },
};
