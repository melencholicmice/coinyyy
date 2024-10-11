import { z } from 'zod';
import CoinId from '../types/coinIds';

export const coinSchema = z.object({
  coin: z
    .string()
    .refine((value) => Object.values(CoinId).includes(value as CoinId), {
      message: 'Invalid coin ID',
    }),
});

export type Coin = z.infer<typeof coinSchema>;
