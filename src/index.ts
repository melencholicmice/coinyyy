import cors from 'cors';
import http from 'http';
import express from 'express';
import addRoutes from './routes';
import logger from './utils/logger';
import config from './config/config';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import connectDb from './utils/connectDb';
import { addJob } from './utils/queue';
import latestCoinRecordManager from './utils/LatestCoinRecord';

const app = express();

app.use(
  cors({
    credentials: true,
    methods: config.cors.methods,
    origin: config.cors.origin,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

addRoutes(app);

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDb();
    await addJob({ name: 'fetchCoinData' });
    server.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}/`);
    });
    await latestCoinRecordManager.setLatestCoinRecords();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

startServer();
