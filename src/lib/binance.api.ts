import BigNumber from 'bignumber.js';
import Binance, { AssetBalance } from 'binance-api-node';
import { environment } from '../environments/environment';

export class BinanceApi {
  private binance = Binance({
    apiKey: environment.API_KEY,
    apiSecret: environment.API_SECRET,
  });

  /**
   * 全通貨の現在保有額を取得
   *
   * @param minQuantity 最小数量
   * @param includeLocked 注文中の数量を含むか
   * @returns 全通貨の現在保有額
   */
  async getAllBalances(minQuantity: number, includeLocked: boolean) {
    const accountInfo = await this.binance.accountInfo();
    const balances = accountInfo.balances;

    /** 最小数量を超えた仮想通貨名を抽出(ex. [BTC, ETH, ...]) */
    const orMoreMinQuantity = (balance: AssetBalance) => {
      const freeB = new BigNumber(parseFloat(balance.free));
      const lockedB = new BigNumber(parseFloat(balance.locked));
      // 対象とする数量
      const targetB = includeLocked ? freeB.plus(lockedB) : freeB;
      // 最小数量以上の通貨のみにfilter
      return targetB.toNumber() > minQuantity;
    };

    return balances.filter(orMoreMinQuantity);
  }
}
