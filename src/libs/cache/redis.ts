import { env } from 'config/env';
import Redis from 'ioredis';

const options = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};
export const redis =
  process.env.NODE_ENV !== 'test' ? new Redis(options) : null;
