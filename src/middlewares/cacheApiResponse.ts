import Redis from 'ioredis';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import redisConnection from '../utils/connectReddis';
import latestCoinRecordManager from '../utils/LatestCoinRecord';

export const cacheApiResponse = (
  duration: number,
  latestTimeCaching: boolean
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const key = `api:${req.method}:${req.originalUrl}:${JSON.stringify(req.body)}`;

    try {
      const cachedResponse = await redisConnection.get(key);

      if (cachedResponse) {
        res.json(JSON.parse(cachedResponse));
        return;
      }

      if (latestTimeCaching) {
        duration = await latestCoinRecordManager.getTimeDifference(
          req.body.coinId
        );
        duration *= 60;
      }

      const originalJson = res.json;
      res.json = function (body) {
        redisConnection.setex(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Redis caching error:', error);
      next();
    }
  };
};
