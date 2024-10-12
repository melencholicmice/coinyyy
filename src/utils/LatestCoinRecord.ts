import { Coin, ICoinModel } from '../models/coins.model';
import CoinId from '../types/coinIds';
import redisConnection from '../utils/connectReddis';
import logger from '../utils/logger';

class LatestCoinRecordManager {
  private redis: typeof redisConnection;

  constructor() {
    this.redis = redisConnection;
    logger.info('LatestCoinRecordManager initialized');
  }

  async setLatestCoinRecords(): Promise<void> {
    logger.info('Setting latest coin records');
    for (const coinId of Object.values(CoinId)) {
      const latestCoin = await Coin.findOne({ coinId })
        .sort({ createdAt: -1 })
        .exec();

      if (latestCoin) {
        const createdAt = (latestCoin as ICoinModel).createdAt;
        await this.redis.set(
          `latest_coin_record:${coinId}`,
          createdAt.toISOString()
        );
        logger.debug(
          `Set latest coin record for ${coinId}: ${createdAt.toISOString()}`
        );
      } else {
        logger.warn(`No coin record found for ${coinId}`);
      }
    }
    logger.info('Finished setting latest coin records');
  }

  async getLatestCoinRecordTime(coinId: CoinId): Promise<string> {
    logger.debug(`Getting latest coin record time for ${coinId}`);
    const latestRecord = await this.redis.get(`latest_coin_record:${coinId}`);
    if (latestRecord) {
      logger.debug(`Found latest record for ${coinId}: ${latestRecord}`);
      return latestRecord;
    } else {
      const currentTime = new Date().toISOString();
      logger.warn(
        `No latest record found for ${coinId}, using current time: ${currentTime}`
      );
      return currentTime;
    }
  }

  async getTimeDifference(coinId: CoinId): Promise<number> {
    logger.debug(`Calculating time difference for ${coinId}`);
    const latestRecordTime = await this.getLatestCoinRecordTime(coinId);
    const currentTime = new Date();
    const latestTime = new Date(latestRecordTime);

    const timeDelta = currentTime.getTime() - latestTime.getTime();
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
    const result = Math.min(twoHoursInMilliseconds, timeDelta);
    logger.debug(`Time difference for ${coinId}: ${result}ms`);
    return result;
  }

  async updateAllLatestCoinRecordsToCurrentTime(): Promise<void> {
    logger.info('Updating all latest coin records to current time');
    const currentTime = new Date().toISOString();
    for (const coinId of Object.values(CoinId)) {
      await this.redis.set(`latest_coin_record:${coinId}`, currentTime);
      logger.debug(`Updated latest coin record for ${coinId} to ${currentTime}`);
    }
    logger.info('Finished updating all latest coin records to current time');
  }
}

const latestCoinRecordManager = new LatestCoinRecordManager();

export default latestCoinRecordManager;
