import Image from "next/image";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const TeaLeaf = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="18" rx="10" ry="18" fill="#A3C585" />
    <path d="M18 36C18 24 18 12 18 0" stroke="#6B8E23" strokeWidth="2" />
  </svg>
);

export default function Home() {
  // 記事一覧を取得
  const dir = path.join(process.cwd(), 'src/content/blog');
  const files = fs.readdirSync(dir);
  const posts = files.map((file) => {
    const fileContents = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: file.replace(/\.md$/, ''),
      ...(data as any),
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white/90 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-center items-center h-20 gap-6">
          <TeaLeaf />
          <span className="text-3xl font-bold tracking-tight text-center">HealTea</span>
          <TeaLeaf />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">お茶と健康のブログ</h1>
          <p className="text-lg text-gray-500 mb-2">お茶の歴史、日本料理・旅館・おもてなし、健康診断、そしてお茶と健康をテーマに発信します。</p>
          <p className="text-sm text-gray-400">（インスタ・TikTok連携も今後予定）</p>
        </section>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {posts.slice(0, 6).map((post) => (
            <article key={post.slug} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="mb-2 text-xs text-gray-400 flex items-center gap-2 flex-wrap">
                    <span>{post.date}</span>
                    <span>・</span>
                    {post.tags && post.tags.map((tag: string) => (
                      <span key={tag} className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-xs mr-1">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">{post.description || ''}</p>
                </div>
                <div className="mt-4">
                  <Link href={`/blog/${post.slug}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full text-center">
                    続きを読む
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
        {/* カテゴリーボタン欄 */}
        <section className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-6">
            <Link href="/category/日本茶"><span className="px-8 py-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition text-gray-800 font-bold text-xl text-center block">日本茶</span></Link>
            <Link href="/category/日本の食べ物"><span className="px-8 py-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition text-gray-800 font-bold text-xl text-center block">日本の食べ物</span></Link>
            <Link href="/category/健康関連"><span className="px-8 py-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition text-gray-800 font-bold text-xl text-center block">健康関連</span></Link>
            <Link href="/category/おもてなし"><span className="px-8 py-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition text-gray-800 font-bold text-xl text-center block">おもてなし</span></Link>
          </div>
        </section>
      </main>
      <footer className="bg-white border-t border-gray-200 py-8 mt-12 text-center text-gray-400 text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
