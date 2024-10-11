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
   *   post:
   *     summary: Get coin statistics by ID
   *     tags: [Coins]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               coin:
   *                 type: string
   *             required:
   *               - coin
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Bad request
   */
  app.post(
    '/stats',
    validateRequest(coinSchema),
    // cacheApiResponse(30, false),
    coinController.getCoinsById
  );

  /**
   * @openapi
   * /deviation:
   *   post:
   *     summary: Get standard deviation for coins
   *     tags: [Coins]
   *     requestBody:
   *       required: true
   *       ontent:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               coin:
   *                 type: string
   *             required:
   *               - coin
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Bad request
   */
  app.post(
    '/deviation',
    validateRequest(coinSchema),
    // cacheApiResponse(0, true),
    coinController.getStandardDeviation
  );
}
export default addRoutes;
