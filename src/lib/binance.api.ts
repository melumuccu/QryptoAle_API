import BigNumber from 'bignumber.js';
import { keyOfBinance } from '../config/api';
import { Balance } from '../shared/types';

// Binance ログイン
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Binance = require('node-binance-api');
const binance = new Binance().options(keyOfBinance);

export class BinanceApi {
  /**
   * 全ペアの現在保有額を取得
   * @param includeOnOrder 注文中の数量を含むか
   * @param binance
   * @returns 全ペアの現在保有額
   */
  getAllBalances(includeOnOrder: boolean): Promise<Balance> {
    return new Promise(resolve => {
      const balanceOfHasCoins: Balance = {};
      binance.balance(function (error: string, balances: Balance) {
        // 保有している通貨のみに限定
        for (const balance in balances) {
          const availableB = new BigNumber(parseFloat(balances[balance].available));
          const onOrderB = new BigNumber(parseFloat(balances[balance].onOrder));

          let tmpBalanceB;
          if (includeOnOrder) {
            // 注文中の数量を含む
            tmpBalanceB = availableB.plus(onOrderB);
          } else {
            // 注文中の数量を含まない
            tmpBalanceB = availableB;
          }

          if (tmpBalanceB.toNumber() !== 0) {
            balanceOfHasCoins[balance] = balances[balance];
            // console.log("file: binanceUtil.ts => line 130 => binance.balance => balanceOfHasCoins", balanceOfHasCoins);
          }
        }

        return resolve(balanceOfHasCoins);
      });
    });
  }
}
