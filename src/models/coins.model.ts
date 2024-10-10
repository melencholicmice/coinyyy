import mongoose, { Schema, Document } from 'mongoose';
import CoinId from '../types/coinIds';

interface ICoin {
  price: number;
  marketCap: number;
  '24hChange': number;
}

interface ICoinModel extends ICoin, Document {}

const CoinSchema: Schema = new Schema(
  {
    coinId: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(CoinId),
    },
    price: { type: Number, required: true },
    marketCap: { type: Number, required: true, unique: true },
    '24hChange': { type: Number, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Coin = mongoose.model<ICoinModel>('Coin', CoinSchema);

export { Coin, ICoin, ICoinModel };
