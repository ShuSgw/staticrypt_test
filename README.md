# staticrypt_test

ランダム画像を使ったダミーサイトを、1ファイルのHTMLにビルドし、[StatiCrypt](https://github.com/robinmoisson/staticrypt) でパスワード保護して GitHub Pages に公開する検証用プロジェクト。

公開URL: https://shusgw.github.io/staticrypt_test/

## やったこと

1. [picsum.photos](https://picsum.photos/) からランダム画像を取得し、ダミーサイトを作成（`index.html` / `style.css` / `script.js`）
2. CSS・JS・画像（base64）をすべて埋め込んだ1ファイルのHTMLにビルド（`build.mjs`）
3. StatiCrypt でHTML全体をAESで暗号化し、パスワード画面を付与（`encrypt.mjs`）
4. パスワード画面を独自デザイン化（`password_template.html`）、日本語化、ログアウトボタンを追加
5. 全ページに `noindex, nofollow, noarchive` を設定
6. パスワードは `.env` で管理（`.env` は git に上げない）
7. `main` に push すると GitHub Actions がビルドし、`gh-pages` ブランチに公開（`.github/workflows/deploy.yml`）

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` `style.css` `script.js` | サイトのソース |
| `images/` | ダミー画像（`npm run fetch-images` で再取得） |
| `build.mjs` | CSS・JS・画像を埋め込み、`.build/index.html` を作る |
| `encrypt.mjs` | `.build/index.html` を暗号化して `dist/index.html` に出力 |
| `password_template.html` | パスワード画面のテンプレート（StatiCryptの標準テンプレートを改変） |
| `.staticrypt.json` | 暗号化のsalt（秘密ではない。消すと全員のログイン保存が無効になる） |
| `.env` | パスワード（git管理外）。雛形は `.env.example` |
| `dist/` | 公開用の出力（git管理外。CIが生成） |

## 使い方

```bash
npm install

# 画像を取り直す（任意）
npm run fetch-images

# ビルド＋暗号化 → dist/index.html
npm run build
```

パスワードは `.env` の `STATICRYPT_PASSWORD` に書く。

```
STATICRYPT_PASSWORD=好きなパスワード
```

`.env` の値は、ターミナルに残っている環境変数より優先される。`.env` がない環境（CI）では環境変数 `STATICRYPT_PASSWORD` を使う。

`npm run build` は次の3つを順に実行する。

1. `bundle` … 1ファイルにまとめる
2. `encrypt` … 暗号化して `dist/` に出力
3. `clean` … 暗号化前の一時ファイル `.build/` を削除

## 公開（GitHub Pages）

`main` への push で `.github/workflows/deploy.yml` が動き、`dist/` を `gh-pages` ブランチに公開する（毎回作り直すので履歴は残らない）。

初回のみ GitHub 側で設定する。

1. Settings → Secrets and variables → Actions → **Secrets** に `STATICRYPT_PASSWORD` を登録
2. Settings → Actions → General → Workflow permissions を **Read and write permissions** に
3. Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`

## セキュリティ上の注意

- 暗号化されるのは `dist/index.html` のみ。`index.html` などの元ソースは暗号化されないので、リポジトリを公開すると中身も公開される。
- ファイルを丸ごと入手した人は、手元でパスワードを何度でも試せる（回数制限できない）。強度はパスワード次第なので、実運用ではランダムな16文字以上にする。
- 復号後のページは、保存や開発者ツールでの閲覧ができる。
- 守りたい内容がある場合は、HTMLに中身を入れず、トークン付きAPIから取得する構成や、サーバー側の認証を検討する。
- `noindex` は検索エンジンへのお願いで、アクセス制限ではない。
