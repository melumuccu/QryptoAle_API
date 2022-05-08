export class OtherApi {
  /**
   * 現在の円/ドルレートを取得
   *
   * @returns 現在の円/ドルレート
   */
  async fetchRateOfUsdToJpy() {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();
    const rateOfUsdToJpy = data.rates.JPY;
    console.log(
      'file: binance.api.ts => line 59 => fetchRateOfUsdToJpy => rateOfUsdToJpy',
      rateOfUsdToJpy
    );
    return rateOfUsdToJpy;
  }
}
