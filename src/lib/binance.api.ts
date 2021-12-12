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
   * @param minQuantity 最小数量
   * @param includeOnOrder 注文中の数量を含むか
   * @returns 全通貨の現在保有額
   */
  getAllBalances(minQuantity: number, includeOnOrder: boolean): Promise<ProcessedBalance[]> {
    return new Promise(resolve => {
      binance.balance((error: string, balances: Balance) => {
        // 最小数量を超えた仮想通貨名を抽出(ex. [BTC, ETH, ...])
        const cryptosOrMoreMinQuantity = Object.keys(balances).filter(crypto => {
          const availableB = new BigNumber(parseFloat(balances[crypto].available));
          const onOrderB = new BigNumber(parseFloat(balances[crypto].onOrder));
          // 対象とする数量
          const targetB = includeOnOrder ? availableB.plus(onOrderB) : availableB;
          // 最小数量以上の通貨のみにfilter
          return targetB.toNumber() > minQuantity;
        });
        console.log(
          'file: binance.api.ts => line 36 => cryptosOrMoreMinQuantity => cryptosOrMoreMinQuantity',
          cryptosOrMoreMinQuantity
        );

        // memo: フロント側で扱いやすい形に変換している
        return resolve(
          cryptosOrMoreMinQuantity.map(crypto => {
            return {
              crypto,
              available: balances[crypto].available,
              onOrder: balances[crypto].onOrder,
            };
          })
        );
      });
    });
  }
}
