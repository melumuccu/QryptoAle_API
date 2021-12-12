import express from 'express';
import { BinanceApi } from './lib/binance.api';

const binanceApi = new BinanceApi();

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

app.get('/balances', async (req: express.Request, res: express.Response) => {
  console.log('***** START-/balances *****');
  const allBalances = await binanceApi.getAllBalances(0, true).catch(error => console.error(error));
  console.log('file: app.ts => line 26 => app.get => allBalances', allBalances);
  console.log('***** END-/balances *****');
  res.send(allBalances);
});
