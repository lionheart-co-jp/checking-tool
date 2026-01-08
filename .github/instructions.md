# Checking Support Tool - プロジェクト仕様書

## 概要

Webサイトの品質チェックを支援するデスクトップアプリケーションです。指定されたURLのHTML構造を解析し、以下の項目をチェックします：

- **タイトル/メタ情報チェック**: `<title>` タグおよび `<meta>` タグの内容確認
- **画像altチェック**: `<img>` タグの `alt` 属性の存在・内容確認
- **見出しチェック**: `<h1>` 〜 `<h5>` タグの構造チェック
- **リンクチェック**: `<a>` タグのリンク先存在確認

## 技術スタック

### フロントエンド

| ライブラリ | バージョン | 用途 |
|------------|------------|------|
| React | ^18.3.1 | UIフレームワーク |
| TypeScript | ^5.9.3 | 型付きJavaScript |
| Vite | ^4.5.14 | ビルドツール・開発サーバー |
| Ant Design | ^5.29.3 | UIコンポーネントライブラリ |
| @ant-design/pro-layout | ^7.22.7 | レイアウトコンポーネント |
| @ant-design/icons | ^5.6.1 | アイコンセット |
| React Router DOM | ^6.30.3 | ルーティング |
| Recoil | ^0.7.7 | 状態管理 |
| i18next | ^22.5.1 | 多言語対応（日本語/英語） |
| react-i18next | ^12.3.1 | React用i18n連携 |
| @emotion/react | ^11.14.0 | CSS-in-JS |
| @emotion/styled | ^11.14.1 | CSS-in-JS |

### バックエンド（Rust/Tauri）

| ライブラリ | バージョン | 用途 |
|------------|------------|------|
| Tauri | 1.2.4 | デスクトップアプリフレームワーク |
| reqwest | 0.11.17 | HTTPクライアント |
| scraper | 0.16.0 | HTMLパーサー |
| serde | 1.0.160 | シリアライズ/デシリアライズ |
| serde_json | 1.0.96 | JSONサポート |
| regex | 1.8.1 | 正規表現 |

### 開発ツール

| ツール | バージョン | 用途 |
|--------|------------|------|
| ESLint | ^8.57.1 | リンター |
| Prettier | ^2.8.8 | コードフォーマッター |
| @tauri-apps/cli | ^1.6.3 | Tauri CLI |

## フォルダ構成

```
checking-tool/
├── index.html              # エントリーHTML
├── package.json            # npm依存関係・スクリプト
├── tsconfig.json           # TypeScript設定
├── tsconfig.node.json      # Node用TypeScript設定
├── vite.config.ts          # Vite設定
├── README.md               # プロジェクト説明
│
├── src/                    # フロントエンドソース
│   ├── App.tsx             # メインAppコンポーネント（ルーティング定義）
│   ├── main.tsx            # エントリーポイント（i18n初期化、React起動）
│   ├── style.css           # グローバルスタイル
│   ├── vite-env.d.ts       # Vite型定義
│   │
│   ├── Atoms/              # Recoil状態管理（Atom）
│   │   ├── BulkUrl.ts      # 一括URL入力状態
│   │   ├── BulkUrlResult.ts # 一括URL結果状態
│   │   ├── DarkMode.ts     # ダークモード状態
│   │   ├── Language.ts     # 言語設定状態
│   │   ├── Pass.ts         # Basic認証パスワード状態
│   │   ├── PassResult.ts   # パスワード結果状態
│   │   ├── Url.ts          # URL入力状態
│   │   ├── UrlResult.ts    # URL結果状態
│   │   ├── User.ts         # Basic認証ユーザー状態
│   │   └── UserResult.ts   # ユーザー結果状態
│   │
│   ├── Components/         # 再利用可能コンポーネント
│   │   ├── index.tsx       # コンポーネントエクスポート
│   │   ├── AltRow.tsx      # Alt属性表示行
│   │   ├── CommonForm.tsx  # 共通フォーム（単一URL）
│   │   ├── CommonFormBulk.tsx # 共通フォーム（複数URL）
│   │   ├── Image.tsx       # 画像コンポーネント
│   │   ├── LinkRow.tsx     # リンク表示行
│   │   ├── Navigation.tsx  # サイドバーナビゲーション
│   │   ├── PageHeader.tsx  # ページヘッダー
│   │   ├── TitleRow.tsx    # タイトル表示行
│   │   └── VerticalSpace.tsx # 垂直スペーサー
│   │
│   ├── Const/              # 定数定義
│   │   └── App.ts          # アプリ共通定数
│   │
│   ├── i18n/               # 多言語リソース
│   │   ├── en.ts           # 英語翻訳
│   │   └── ja.ts           # 日本語翻訳
│   │
│   └── Pages/              # ページコンポーネント
│       ├── Dashboard.tsx   # ダッシュボード（機能選択画面）
│       ├── Title.tsx       # タイトル/メタ情報チェック画面
│       ├── Alt.tsx         # 画像altチェック画面
│       ├── Headline.tsx    # 見出しチェック画面
│       └── Link.tsx        # リンクチェック画面
│
└── src-tauri/              # Tauriバックエンド（Rust）
    ├── build.rs            # ビルドスクリプト
    ├── Cargo.toml          # Rust依存関係
    ├── Info.plist          # macOS設定
    ├── tauri.conf.json     # Tauri設定
    │
    ├── icons/              # アプリアイコン
    │
    └── src/
        ├── main.rs         # エントリーポイント（コマンド登録）
        ├── lib.rs          # ライブラリモジュール定義
        ├── parse.rs        # URL取得・HTMLパース処理
        │
        └── commands/       # Tauriコマンド
            ├── alt.rs      # get_alt: 画像alt属性取得
            ├── headline.rs # get_headline_list: 見出し一覧取得
            ├── link.rs     # get_link_list: リンク一覧取得
            │               # get_link_available: リンク存在確認
            └── title.rs    # get_title_meta: タイトル/メタ情報取得
```

## Tauriコマンド一覧

フロントエンドから `@tauri-apps/api/tauri` の `invoke` 関数で呼び出すコマンド：

| コマンド名 | 引数 | 戻り値 | 説明 |
|------------|------|--------|------|
| `get_title_meta` | `url`, `user`, `pass` | `HashMap<String, String>` | タイトルとメタ情報を取得 |
| `get_alt` | `url`, `user`, `pass` | `Vec<HashMap<String, String>>` | 画像のsrcとalt属性一覧を取得 |
| `get_headline_list` | `url`, `user`, `pass` | `Vec<HashMap<String, String>>` | 見出しタグ一覧を取得 |
| `get_link_list` | `url`, `user`, `pass` | `Vec<HashMap<String, String>>` | リンク一覧を取得 |
| `get_link_available` | `url`, `user`, `pass` | `Map<String, Value>` | リンク先の存在確認（非同期） |

※ `user`, `pass` はBasic認証用（認証不要な場合は空文字）

## ルーティング

| パス | ページ | 説明 |
|------|--------|------|
| `/` | Dashboard | ダッシュボード（機能選択） |
| `/title/` | Title | タイトル/メタ情報チェック |
| `/alt/` | Alt | 画像altチェック |
| `/headline/` | Headline | 見出しチェック |
| `/link/` | Link | リンクチェック |

## 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発モード起動（デスクトップアプリ）
npm run tauri dev

# フロントエンドのみ起動
npm run dev

# 本番ビルド
npm run tauri build

# TypeScriptコンパイル + Viteビルド
npm run build

# ESLintチェック
npm run lint

# ESLint自動修正
npm run lint:fix
```

## 対応言語

- 英語（en）
- 日本語（ja）

ブラウザの言語設定に基づいて自動選択。手動切替も可能（`localStorage` に保存）。

## 機能詳細

### ダークモード
サイドバーから切り替え可能。Ant DesignのConfigProviderで制御。

### Basic認証対応
チェック対象URLがBasic認証で保護されている場合、ユーザー名とパスワードを入力してアクセス可能。

### 一括チェック
複数URLを改行区切りで入力し、一括でチェック実行が可能。

## 必要環境

- Node.js
- Rust（Tauriビルドに必要）
- macOS / Windows / Linux

## ライセンス

MIT
