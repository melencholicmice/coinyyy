import { CoinController } from './controllers/coins.controller';
import { Express } from 'express';
import { coinSchema } from './schema/coins.schema';
import validateRequest from './middlewares/validateRequest';
import { cacheApiResponse } from './middlewares/cacheApiResponse';

function addRoutes(app: Express): void {
  const coinController = new CoinController();

  app.post('/stats', validateRequest(coinSchema), cacheApiResponse(30,false), coinController.getCoinsById);
  app.post('/deviation', validateRequest(coinSchema), cacheApiResponse(0,true), coinController.getStandardDeviation);
}

export default addRoutes;