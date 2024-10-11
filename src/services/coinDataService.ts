import { Config } from '../config/base';
import config from '../config/config';
import { ICoinData } from '../types/getCoinDataServiceInterface';
import { Coin, ICoinModel } from '../models/coins.model';

class CoinDataService {
  private apiUrl: string = 'https://api.coingecko.com/api/v3/simple/price';
  private config: Config = config;

  private getOptions(): RequestInit {
    return {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': this.config.apiKeys.coinGecko,
      },
    };
  }

  private buildQueryParams(
    ids: string,
    vsCurrencies: string,
    includeMarketCap: boolean,
    include24hrVol: boolean,
    include24hrChange: boolean,
    includeLastUpdatedAt: boolean
  ): URLSearchParams {
    return new URLSearchParams({
      ids,
      vs_currencies: vsCurrencies,
      include_market_cap: includeMarketCap.toString(),
      include_24hr_vol: include24hrVol.toString(),
      include_24hr_change: include24hrChange.toString(),
      include_last_updated_at: includeLastUpdatedAt.toString(),
    });
  }

  public async getCoinData(
    ids: string = 'bitcoin',
    vsCurrencies: string = 'usd',
    includeMarketCap: boolean = true,
    include24hrVol: boolean = false,
    include24hrChange: boolean = true,
    includeLastUpdatedAt: boolean = true
  ): Promise<ICoinData | undefined> {
    try {
      const queryParams = this.buildQueryParams(
        ids,
        vsCurrencies,
        includeMarketCap,
        include24hrVol,
        include24hrChange,
        includeLastUpdatedAt
      );

      const url = `${this.apiUrl}?${queryParams.toString()}`;
      const response = await fetch(url, this.getOptions());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ICoinData = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return undefined;
    }
  }

  public async addCoinData(coinData: ICoinData): Promise<void> {
    try {
      for (const [coinId, coinInfo] of Object.entries(coinData)) {
        try {
          await Coin.create({
            coinId: coinId,
            price: coinInfo.usd,
            marketCap: coinInfo.usd_market_cap,
            '24hChange': coinInfo.usd_24h_change,
          });
          console.log(`Coin data for ${coinId} added successfully.`);
        } catch (error) {
          console.error(`Error adding coin data for ${coinId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error adding coin data:', error);
      throw error;
    }
  }

  public async calculateStandardDeviation(coinId: string): Promise<number> {
    try {
      const lastHundredRecords = (await Coin.find({
        coinId: coinId,
      })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean()
        .exec()) as ICoinModel[];

      if (lastHundredRecords.length === 0) {
        throw new Error(`No records found for coinId: ${coinId}`);
      }

      const prices = lastHundredRecords.map((record) => record.price);
      const mean =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const squaredDifferences = prices.map((price) =>
        Math.pow(price - mean, 2)
      );
      const variance =
        squaredDifferences.reduce((sum, sqDiff) => sum + sqDiff, 0) /
        prices.length;
      const standardDeviation = Math.sqrt(variance);

      return standardDeviation;
    } catch (error) {
      console.error(
        `Error calculating standard deviation for ${coinId}:`,
        error
      );
      throw error;
    }
  }
}

export default CoinDataService;
