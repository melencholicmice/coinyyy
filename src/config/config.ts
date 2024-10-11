import { Config } from './base';
import dotenv from 'dotenv';

dotenv.config();

const createConfig = (): Config => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  if (!process.env.COIN_GECKO_API_KEY) {
    throw new Error(
      'COIN_GECKO_API_KEY is not defined in environment variables'
    );
  }

  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    throw new Error(
      'REDIS_HOST or REDIS_PORT is not defined in environment variables'
    );
  }

  const config: Config = {
    env: 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    database: {
      host: 'localhost',
      port: 27017,
      uri: process.env.MONGO_URI,
    },
    logging: {
      level: 'debug',
      format: 'json',
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    apiKeys: {
      coinGecko: process.env.COIN_GECKO_API_KEY,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
  };

  return config;
};

const config = createConfig();

export default config;
