import CoinDataService from "../services/coinDataService"
import CoinId from "../types/coinIds";
import logger from "../utils/logger";


const getCoinDataTask = async (): Promise<void> => {
    const coinService = new CoinDataService();
    const coinIds = Object.values(CoinId).join(',');
    const coinData = await coinService.getCoinData(coinIds)
    if(!coinData) {
        throw new Error('Failed to get coin data');
    }
    await coinService.addCoinData(coinData);
    logger.info('Coin data added successfully');
} 

export default getCoinDataTask;