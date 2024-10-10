import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import logger from './utils/logger';
import connectDb from './utils/connectDb';
import config from './config/config';

const app = express();

app.use(cors({
    credentials: true,
    methods: config.cors.methods,
    origin: config.cors.origin,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDb();
        server.listen(config.port, () => {
            logger.info(`Server running on http://localhost:${config.port}/`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();