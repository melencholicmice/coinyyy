export interface Config {
  env: string;
  port: number;
  database: {
    host: string;
    port: number;
    username?: string;
    password?: string;
    database?: string;
    uri: string | undefined;
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
    thirdPartyService: string;
  };
}
