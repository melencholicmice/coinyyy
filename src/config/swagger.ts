import swaggerJsdoc from 'swagger-jsdoc';
import config from './config';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KoinX Backend Assignment by Heet  Dhorajiya',
      version: '1.0.0',
      description: 'Backend assignment for KoinX,\n please note that this deployment does not includes periodic coin data fetching and api chaching because it requires reddis and getting a free reddis deployment that just works was not easy :(, please go to the github repo for the complete application.',
      contact: {
        name: 'Heet Dhorajiya',
        email: 'hsdhorajiya80@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CoinData: {
          type: 'object',
          properties: {
            coinId: {
              type: 'string',
            },
            price: {
              type: 'number',
            },
            marketCap: {
              type: 'number',
            },
            '24hChange': {
              type: 'number',
            },
          },
        },
        StandardDeviation: {
          type: 'object',
          properties: {
            deviation: {
              type: 'number',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes.ts'],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
