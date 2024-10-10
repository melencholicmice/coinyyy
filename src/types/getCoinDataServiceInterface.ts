export interface ICoinData {
  [coinName: string]: {
    usd: number;
    usd_market_cap: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
}
