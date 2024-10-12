import { Request, Response } from 'express';
import CoinDataService from '../services/coinDataService';
import CoinId from '../types/coinIds';
import { ICoinData } from '../types/getCoinDataServiceInterface';

export class CoinController {
  private coinService: CoinDataService;

  constructor() {
    this.coinService = new CoinDataService();
  }

  public getCoinsById = async (req: Request, res: Response): Promise<void> => {
    try {
      const coinIds: CoinId = req.query.coin as CoinId;
      let coins: ICoinData | undefined;

      try {
        coins = await this.coinService.getCoinData(coinIds);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching coin data' });
        return;
      }

      if (!coins) {
        res.status(404).json({ error: 'Coins not found' });
        return;
      }

      res.status(200).json(coins);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getStandardDeviation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const coinId: CoinId = req.query.coin as CoinId;

      let standardDeviation: number | undefined;

      try {
        standardDeviation =
          await this.coinService.calculateStandardDeviation(coinId);
      } catch (error) {
        res.status(500).json({ error: 'Error calculating standard deviation' });
        return;
      }

      if (standardDeviation === undefined) {
        res.status(404).json({ error: 'Standard deviation data not found' });
        return;
      }

      res.status(200).json({ deviation: standardDeviation });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}