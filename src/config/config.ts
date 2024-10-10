import { Config } from "./base";
import dotenv from 'dotenv';

dotenv.config();

const config: Config = {
  env: 'development',
  port: 8080,
  database: {
    host: 'localhost',
    port: 27017,
    uri:process.env.MONGO_URI,
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
    thirdPartyService: 'dev_api_key',
  },
};

export default config;
