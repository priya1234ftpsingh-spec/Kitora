import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_tnp_system',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_ai_tnp_2026_academic_bca_token',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  AI_API_KEY: process.env.AI_API_KEY || ''
};
