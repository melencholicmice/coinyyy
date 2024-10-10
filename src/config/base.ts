export interface Config {
  env: string;
  port: number;
  database: {
    host: string;
    port: number;
    username?: string;
    password?: string;
    database?: string;
    uri: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  logging: {
    level: string;
    format: string;
  };
  cors: {
    origin: string;
    methods: string[];
  };
  apiKeys: {
    coinGecko: string;
  };
}
