import { z } from 'zod';
import CoinId from '../types/coinIds';

export const coinSchema = z.object({
  coin: z.enum(Object.values(CoinId) as [string, ...string[]]),
});

export type Coin = z.infer<typeof coinSchema>;
