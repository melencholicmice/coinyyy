import { Config } from '../config/base';
import config from '../config/config';
import { ICoinData } from '../types/getCoinDataServiceInterface';
import { Coin } from '../models/coins.model';

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
        const coinDocument = new Coin({
          coinId: coinId,
          price: coinInfo.usd,
          marketCap: coinInfo.usd_market_cap,
          '24hChange': coinInfo.usd_24h_change,
        });

        await coinDocument.save();
        console.log(`Coin data for ${coinId} added successfully.`);
      }
    } catch (error) {
      console.error('Error adding coin data:', error);
      throw error;
    }
  }
}

export default CoinDataService;
