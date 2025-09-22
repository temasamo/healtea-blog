# HealTea Blog

自然の力をお茶で届けるHealTeaの公式ブログです。お茶の歴史、日本料理、旅館・おもてなし、健康診断などの情報を発信しています。

## 機能

- 📝 マークダウン形式の記事管理
- 🌍 多言語対応（日本語、英語、韓国語、繁体中文、香港繁体）
- 📱 レスポンシブデザイン
- 🔍 SEO最適化
- 📊 Google アナリティクス連携
- ⚡ Next.js 15 + App Router

## 技術スタック

- **Framework**: Next.js 15.4.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown + gray-matter
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、Google アナリティクスの測定IDを設定してください：

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## Google アナリティクス設定

### 1. Google アナリティクスアカウントの作成

1. [Google Analytics](https://analytics.google.com/) にアクセス
2. 新しいプロパティを作成
3. 測定ID（G-XXXXXXXXXX形式）を取得

### 2. 環境変数の設定

`.env.local`ファイルに測定IDを設定：

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. 追跡されるイベント

以下のイベントが自動的に追跡されます：

- **ページビュー**: 各ページの表示
- **記事表示**: 記事ページの表示（タイトル、カテゴリ）
- **言語切り替え**: 多言語切り替えの使用
- **カテゴリクリック**: カテゴリページへの移動

### 4. カスタムイベントの追加

新しいイベントを追跡する場合は、`useAnalytics`フックを使用：

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackEvent } = useAnalytics();

// カスタムイベントの送信
trackEvent('button_click', 'engagement', 'subscribe_button');
```

## 記事の追加

### 新着記事の追加ルール

**重要**: 新しい記事を作成した際は、必ず以下の手順を徹底してください：

1. **日付の設定**: 最新の日付（例：2025-08-31）を設定して、トップページの「新着記事」欄に表示されるようにする
2. **カテゴリの設定**: 適切なカテゴリ（`["日本茶"]`, `["おもてなし"]`, `["日本の農業"]`など）を設定
3. **デプロイの確認**: 記事追加後は必ずデプロイして、以下を確認する：
   - トップページの「新着記事」欄に記事カードが表示される
   - 該当カテゴリページに記事カードが表示される
   - 記事の日付が正しく表示される

### 日本語記事

各カテゴリディレクトリに`.md`ファイルを追加：

```
src/content/blog/
├── about-japanesetea/
├── health/
├── japanesefood/
├── omotenasi/
└── travelers/
```

### 英語記事

`travelers/`ディレクトリに`-en`サフィックス付きで追加：

```
src/content/blog/travelers/
├── 2025-07-29-nihoncha-history-en.md
└── 2025-07-31-ryokan-onsen-en.md
```

### 記事のフロントマター

```yaml
---
title: "記事タイトル"
date: "2025-08-02"
description: "記事の説明"
categories: ["カテゴリ名"]
tags: ["タグ1", "タグ2"]
author: HealTea
image: "/blog/image.jpg"
lang: "ja"  # 英語記事の場合は "en"
---
```

## デプロイ

### Vercelへのデプロイ

```bash
# 本番環境へのデプロイ
vercel --prod

# プレビューデプロイ
vercel
```

### 環境変数の設定

Vercelのダッシュボードで環境変数を設定：

1. プロジェクト設定 → Environment Variables
2. `NEXT_PUBLIC_GA_ID`を追加
3. 本番環境とプレビュー環境の両方に設定

## ディレクトリ構造

```
healtea-blog/
├── src/
│   ├── app/
│   │   ├── blog/[slug]/
│   │   ├── category/[category]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── GoogleAnalytics.tsx
│   │   ├── ArticleAnalytics.tsx
│   │   └── HomeAnalytics.tsx
│   ├── content/blog/
│   │   ├── about-japanesetea/
│   │   ├── health/
│   │   ├── japanesefood/
│   │   ├── omotenasi/
│   │   └── travelers/
│   ├── hooks/
│   │   └── useAnalytics.ts
│   └── lib/
│       └── gtag.ts
├── public/
├── .env.local
└── package.json
```

## ライセンス

© 2025 HealTea. All rights reserved.
