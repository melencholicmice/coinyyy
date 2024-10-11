import { CoinController } from './controllers/coins.controller';
import { Express } from 'express';
import { coinSchema } from './schema/coins.schema';
import validateRequest from './middlewares/validateRequest';

function addRoutes(app: Express): void {
  const coinController = new CoinController();

  app.post('/stats', validateRequest(coinSchema), coinController.getCoinsById);
  app.post('/deviation', validateRequest(coinSchema), coinController.getStandardDeviation);
}

export default addRoutes;
