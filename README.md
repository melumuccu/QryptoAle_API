# REST API 情報

## port

- 3000

## エンドポイント

- /balances

  - 全通貨の現在保有額を取得
  - 返す型

    ```typescript
    {
      crypto: string;
      available: string;
      onOrder: string;
    }
    [];
    ```
