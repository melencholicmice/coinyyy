import { Queue, Job } from 'bullmq';
import redisConnection from './connectReddis';
import logger from './logger';
import getCoinDataTask from '../tasks/getCoinData.tasks';

const QUEUE_NAME = 'dataFetchQueue';
const REPEAT_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const queue = new Queue(QUEUE_NAME, { connection: redisConnection });

interface JobData {
  name: string;
}

const addJob = async (job: JobData): Promise<void> => {
  try {
    const options = { repeat: { every: REPEAT_INTERVAL } };
    await queue.add(job.name, job, options);
    logger.info(
      `Job '${job.name}' added to queue with a repeat interval of ${REPEAT_INTERVAL / (60 * 1000)} minutes.`
    );
  } catch (error) {
    logger.error('Error adding job to queue:', { error });
  }
};

const jobHandler: Record<string, (job: Job<JobData>) => Promise<void>> = {
  fetchCoinData: getCoinDataTask,
};

const processJob = async (job: Job<JobData>): Promise<void> => {
  const handler = jobHandler[job.name];

  if (!handler) {
    logger.error(`No handler found for job '${job.name}'.`);
    return;
  }

  try {
    await handler(job);
    logger.info(
      `Job '${job.name}' with ID '${job.id}' processed successfully.`
    );
  } catch (error) {
    logger.error(`Error processing job '${job.name}' with ID '${job.id}':`, {
      error,
    });
    throw error;
  }
};

export { queue, addJob, QUEUE_NAME, processJob, jobHandler };
