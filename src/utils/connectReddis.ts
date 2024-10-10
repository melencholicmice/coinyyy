// src/utils/redis.ts
import Redis from 'ioredis';
import config from '../config/config';
import logger from './logger';

const createRedisConnection = (): Redis => {
  return new Redis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    reconnectOnError: (err) => err.message.includes('READONLY'),
  });
};

const redisConnection = createRedisConnection();

redisConnection.on('connect', () => {
  logger.info('Successfully connected to Redis');
});

redisConnection.on('ready', () => {
  logger.info('Redis connection is ready');
});

redisConnection.on('error', (error) => {
  logger.error('Redis connection error:', { error });
});

export default redisConnection;
