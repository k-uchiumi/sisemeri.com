# sisemeri.com

sisemeri（内海賢一）の営業支援サイト。EmDash 1.x（Astro）で作り、Cloudflare Workers + D1 + R2 で動かしている。
元は EmDash 公式テンプレート `marketing-cloudflare`。

## 構成

| 置き場所 | 中身 |
|---|---|
| このリポジトリ | デザイン・ページの型（Astro のコード）、初期コンテンツ `seed/seed.json` |
| D1 `sisemeri` | 文章・メニュー・サイト設定・フォームの受信内容 |
| R2 `sisemeri-media` | 画像（ロゴ・ファビコンなど） |

- 公開: `main` に push すると Cloudflare Workers Builds がビルドしてデプロイする（Worker 名 `sisemeri-com`）
- 文章の更新: 管理画面 `/_emdash/admin`、または EmDash の MCP（`/_emdash/api/mcp`、Claude.ai のコネクタ「sisemeri」）
- お問い合わせフォーム: `@emdash-cms/plugin-forms`（スパム対策はハニーポット）。フォームは管理画面で作り、スラッグ `contact` で `/contact` に埋め込む
- イメージカラー: ロゴのオレンジ `#ED7918`（`src/styles/theme.css`）

## 手元で動かす

```bash
npm install
npm run dev
```

http://localhost:4321/_emdash/admin で初期設定をすると、`seed/seed.json` の内容が入る。

## トラブル

- 「Database migrations are required」が出る: 初回のテーブル作成が途中で止まり、ロックが残っている。
  D1 のコンソールで `UPDATE _emdash_migrations_lock SET is_locked = 0;` を実行してから、サイトを1回開いて1分待つ。
- push してもデプロイされない: Cloudflare 側の Git 接続が切れていないか、`wrangler.jsonc` の `name` が Worker 名（`sisemeri-com`）と一致しているかを確認する。
