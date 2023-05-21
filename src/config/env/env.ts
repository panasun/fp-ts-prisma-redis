/* eslint-disable max-len */
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: +process.env.REDIS_PORT || 6379,
  CACHE_KEY_PREFIX: process.env.CACHE_KEY_PREFIX || 'LOCAL',
  DEFAULT_CACHE_EXPIRATION: +process.env.DEFAULT_CACHE_EXPIRATION || 60000,
  ENABLED_CACHE: !!process.env.ENABLED_CACHE || false,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:4000',
  EXCHANGE_ACCOUNT_ID: process.env.EXCHANGE_ACCOUNT_ID || 'EXCHANGE_ACCOUNT',
  EXCHANGE_WALLET_ID: process.env.EXCHANGE_WALLET_ID || 'EXCHANGE_WALLET',
  EXCHANGE_EMAIL: process.env.EXCHANGE_EMAIL || 'exchange@example.com',
  SERVICE_ACCOUNT_KEY: process.env.SERVICE_ACCOUNT_KEY || 'SERVICE_ACCOUNT_KEY',
};
