import BigNumber from 'bignumber.js';
import { keyOfBinance } from '../config/api';
import { Balance } from '../shared/types';

// Binance ログイン
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Binance = require('node-binance-api');
const binance = new Binance().options(keyOfBinance);

type ProcessedBalance = {
  crypto: string;
  available: string;
  onOrder: string;
};

export class BinanceApi {
  /**
   * 全通貨の現在保有額を取得
   *
   * @param includeOnOrder 注文中の数量を含むか
   * @param binance
   * @returns 全通貨の現在保有額
   */
  getAllBalances(includeOnOrder: boolean): Promise<ProcessedBalance[]> {
    return new Promise(resolve => {
      binance.balance(function (error: string, balances: Balance) {
        // 対象数量が0でない仮想通貨名(ex. [BTC, ETH, ...])
        const over0Cryptos = Object.keys(balances).filter(crypto => {
          const availableB = new BigNumber(parseFloat(balances[crypto].available));
          const onOrderB = new BigNumber(parseFloat(balances[crypto].onOrder));
          // 対象数量
          const targetB = includeOnOrder ? availableB.plus(onOrderB) : availableB;
          // 保有している通貨のみに限定
          return targetB.toNumber() > 0;
        });
        console.log('対象数量が0でない仮想通貨: ', over0Cryptos);

        const balanceOfOver0Cryptos: ProcessedBalance[] = [];
        over0Cryptos.map(over0Crypto => {
          const processed: ProcessedBalance = {
            crypto: over0Crypto,
            available: balances[over0Crypto].available,
            onOrder: balances[over0Crypto].onOrder,
          };
          balanceOfOver0Cryptos.push(processed);
        });

        return resolve(balanceOfOver0Cryptos);
      });
    });
  }
}
