import dotenv from 'dotenv';
dotenv.config()
export default {
    JWT_SECRET: process.env.JWT_SECRET || '',
    DB: process.env.DB || '',
    PORT: process.env.PORT || '3001',
    DEBUG: process.env.DEBUG || '1',
    TOKEN_EXPIRE_MS: process.env.TOKEN_EXPIRE_MS || 86400000,
    HEROKU_HOST: process.env.HEROKU_HOST || `http://localhost:5001`
}