import { CoinController } from './controllers/coins.controller';
import { Express } from 'express';
import { coinSchema } from './schema/coins.schema';
import validateRequest from './middlewares/validateRequest';
import { cacheApiResponse } from './middlewares/cacheApiResponse';
import { swaggerDocs } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

function addRoutes(app: Express): void {
  const coinController = new CoinController();
  app.use('/', swaggerUi.serve);
  app.get('/', swaggerUi.setup(swaggerDocs));

  /**
   * @openapi
   * /stats:
   *   get:
   *     summary: Get coin statistics by ID
   *     tags: [Coins]
   *     parameters:
   *       - in: query
   *         name: coin
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Bad request
   */
  app.get(
    '/stats',
    validateRequest(coinSchema),
    coinController.getCoinsById
  );

  /**
   * @openapi
   * /deviation:
   *   get:
   *     summary: Get standard deviation for coins
   *     tags: [Coins]
   *     parameters:
   *       - in: query
   *         name: coin
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Bad request
   */
  app.get(
    '/deviation',
    cacheApiResponse(0, true),
    coinController.getStandardDeviation
  );
}
export default addRoutes;