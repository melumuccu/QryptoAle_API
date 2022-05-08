import express from 'express';
import { BinanceApi } from './lib/binance.api';
import { OtherApi } from './lib/other.api';

const binanceApi = new BinanceApi();
const otherApi = new OtherApi();

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CROS対応
// TODO 完全無防備：本番環境ではだめ絶対
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.listen(3000, () => {
  console.log('Start on port 3000.');
});

/**
 * 全通貨の現在保有額をresponseする
 *
 * クエリパラメータ
 * ・minQuantity: number
 *     ・通貨の最小数量
 *     ・default: 0
 * ・includeLocked: boolean
 *     ・ロックされている(=注文中の)数量を含めるか
 *     ・default: true
 */
app.get('/balances', async (req: express.Request, res: express.Response) => {
  console.log('***** START-/balances *****');
  // クエリパラメータのチェック
  const minQuantity = req.query.minQuantity ? Number(req.query.minQuantity) : 0;
  const includeLocked = req.query.includeLocked ? Boolean(req.query.includeLocked) : true;
  console.log('クエリパラメータ: minQuantity=', minQuantity, ' includeLocked=', includeLocked);

  const allBalances = await binanceApi
    .getAllBalances(minQuantity, includeLocked)
    .catch(error => console.error(error));
  console.log('file: app.ts => line 26 => app.get => allBalances', allBalances);
  console.log('***** END-/balances *****');
  res.send(allBalances);
});

/**
 * 全てのシンボルの現在レートを取得する
 */
app.get('/rates', async (req: express.Request, res: express.Response) => {
  console.log('***** START-/rates *****');
  const rates = await binanceApi.fetchNowSymbolPrice();
  console.log('file: app.ts => line 55 => app.get => rates', rates);
  console.log('***** END-/rates *****');
  res.send(rates);
});

/**
 * 指定ペアの変換レートを取得する
 *
 * クエリパラメータ
 * convertFrom: string
 *     ・変換前となる通貨
 * convertTo: string
 *     ・変換後となる通貨
 */
app.get('/rate', async (req: express.Request, res: express.Response) => {
  console.log('***** START-/rate *****');
  // クエリパラメータのチェック
  const convertFrom = req.query.convertFrom || undefined;
  const convertTo = req.query.convertTo || undefined;
  console.log('クエリパラメータ: convertFrom=', convertFrom, ' convertTo=', convertTo);

  // TODO 各種通貨のUSDT変換に対応
  const rate = await otherApi.fetchRateOfUsdToJpy();
  // convertFrom === 'USD' && convertTo === 'JPY'
  //   ? await binanceApi.fetchRateOfUsdToJpy().catch(error => console.error(error))
  //   : false;
  console.log('file: app.ts => line 78 => app.get => rate', rate);
  console.log('***** END-/rate *****');
  res.sendStatus(Number(rate));
  // TODO なんかエラーになる... レートの取得はできているのにアプリ側でレスポンスがエラー。定数をこちらから返した場合は問題なし
});
