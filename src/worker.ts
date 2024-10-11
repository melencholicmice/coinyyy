import { Worker } from 'bullmq';
import { QUEUE_NAME, processJob } from './utils/queue';
import redisConnection from './utils/connectReddis';
import logger from './utils/logger';
import connectDb from './utils/connectDb';

connectDb();

const worker = new Worker(QUEUE_NAME, processJob, {
  connection: redisConnection,
});

worker.on('completed', (job) => {
  logger.info(`Job '${job.name}' completed successfully`, { jobId: job.id });
});

worker.on('failed', (job, error) => {
  if (!job) {
    logger.error('Job failed without job details', { error });
    return;
  }

  logger.error(`Job '${job.name}' failed`, { jobId: job.id, error });
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker...');

  try {
    await worker.close();
    logger.info('Worker closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error while closing worker', { error });
    process.exit(1);
  }
});
