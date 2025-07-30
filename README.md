# HealTea Blog

日本茶と健康をテーマにしたブログサイトです。

## 🚀 デプロイ手順

### Vercelでのデプロイ（推奨）

1. **Vercelアカウント作成**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubアカウントでサインアップ

2. **プロジェクトのインポート**
   - "New Project"をクリック
   - GitHubリポジトリを選択
   - 自動的にNext.jsプロジェクトとして認識されます

3. **環境変数の設定**
   - プロジェクト設定で環境変数を追加：
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=HealTea
   ```

4. **デプロイ**
   - "Deploy"をクリック
   - 数分でデプロイ完了

### その他のプラットフォーム

#### Netlify
- `netlify.toml`ファイルを追加
- GitHubと連携して自動デプロイ

#### GitHub Pages
- `next.config.ts`で`output: 'export'`を設定
- GitHub Actionsでビルド・デプロイ

## 📁 プロジェクト構造

```
healtea-blog/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # 日本語トップページ
│   │   ├── en/page.tsx     # 英語トップページ
│   │   ├── blog/[slug]/    # ブログ記事ページ
│   │   └── category/[category]/ # カテゴリーページ
│   ├── components/         # Reactコンポーネント
│   └── content/blog/       # Markdown記事
├── public/
│   └── images/            # 画像ファイル
└── package.json
```

## 🛠 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

## 🌐 多言語対応

- `/` - 日本語版
- `/en` - 英語版
- 今後追加予定：韓国語、中国語（繁体字・簡体字）

## 📝 記事の追加

1. `src/content/blog/`にMarkdownファイルを追加
2. フロントマターに必要なメタデータを記述
3. 画像は`public/images/`に配置

## 🔧 技術スタック

- **フレームワーク**: Next.js 15.4.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **コンテンツ**: Markdown + gray-matter
- **デプロイ**: Vercel（推奨）
