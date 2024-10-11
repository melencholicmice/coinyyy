import mongoose from 'mongoose';
import config from '../config/config';
import logger from './logger';

async function connectDb(): Promise<void> {
  try {
    logger.info('Connecting to MongoDB...');
    if (!config.database.uri) {
      throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(config.database.uri).then(() => {
      logger.info('Connected to MongoDB');
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export default connectDb;
