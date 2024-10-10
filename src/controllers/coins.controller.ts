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
      const coinIds: CoinId = req.body.coin;
      const coins: ICoinData | undefined =
        await this.coinService.getCoinData(coinIds);

      if (!coins) {
        res.status(404).json({ error: 'Coins not found' });
        return;
      }

      res.status(200).json(coins);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
