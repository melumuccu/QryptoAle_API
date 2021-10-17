import { BinanceApi } from './lib/binance.api';

const binanceApi = new BinanceApi();

(async () => {
  const allBalances = await binanceApi.getAllBalances(true).catch(error => console.error(error));
  console.log(allBalances);
})();
