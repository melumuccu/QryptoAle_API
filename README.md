# QryptoAle_API

## 使用している言語、技術、ライブラリ他

| 名称             | バージョン | memo                        |
| ---------------- | ---------- | --------------------------- |
| Node.js          | 16.13.1    |                             |
| Typescript       | 4.4.4      |                             |
| binance-api-node | 0.11.28    | BinanceAPI を叩くライブラリ |
| bignumber.js     | 9.0.1      | 少数計算のため導入          |

## REST API 情報

### port

- 3000

### エンドポイント

- /balances
  - 全通貨の現在保有額を取得
  - 返す型
    - AssetBalance[] (binance-api-node)
  - クエリパラメータ
    - minQuantity: number
      - 通貨の最小数量
      - default: 0
    - includeLocked: boolean
      - ロックされている(=注文中の)数量を含めるか
      - default: true
