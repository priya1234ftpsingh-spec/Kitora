import api from './api.js';

export const aiService = {
  analyzeResume: async (resumeText = '') => {
    const res = await api.post('/ai/resume-analysis', { resumeText });
    return res.data;
  },

  analyzeSkillGap: async (targetRoleOrSkills) => {
    const res = await api.post('/ai/skill-gap', { targetRoleOrSkills });
    return res.data;
  },

  getDriveMatch: async (driveId) => {
    const res = await api.get(`/ai/drive-match/${driveId}`);
    return res.data;
  },

  getCareerRecommendations: async () => {
    const res = await api.get('/ai/career-recommendations');
    return res.data;
  },

  sendChatMessage: async (message, chatHistory = []) => {
    const res = await api.post('/ai/chat', { message, chatHistory });
    return res.data;
  },
};
