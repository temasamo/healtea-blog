import Image from "next/image";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const TeaLeaf = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="16" rx="8" ry="14" fill="#8b7355" opacity="0.8" />
    <path d="M16 30C16 20 16 10 16 2" stroke="#a67c52" strokeWidth="1.5" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f6f3] to-[#f5f2ed] text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d4c4a8]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex justify-center items-center h-24 gap-8">
          <TeaLeaf />
          <span className="text-4xl font-light tracking-wider text-center teaver-heading">HealTea</span>
          <TeaLeaf />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-light mb-8 tracking-wide teaver-heading">
            お茶と健康の<br />
            <span className="text-[#8b7355]">ブログ</span>
          </h1>
          <p className="text-xl text-[#6b7280] mb-4 teaver-text max-w-3xl mx-auto">
            お茶の歴史、日本料理・旅館・おもてなし、健康診断、そしてお茶と健康をテーマに発信します。
          </p>
          <p className="text-sm text-[#9ca3af]">（インスタ・TikTok連携も今後予定）</p>
        </section>

        {/* Latest Articles */}
        <section className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center teaver-heading">最新記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 6).map((post) => (
              <article key={post.slug} className="teaver-card rounded-2xl overflow-hidden h-full">
                <div className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="mb-4 text-xs text-[#9ca3af] flex items-center gap-2 flex-wrap">
                      <span>{post.date}</span>
                      <span>・</span>
                      {post.tags && post.tags.map((tag: string) => (
                        <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] rounded-full px-3 py-1 text-xs mr-1">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-medium mb-3 teaver-heading leading-relaxed">{post.title}</h3>
                    <p className="text-[#6b7280] mb-4 teaver-text line-clamp-3">{post.description || ''}</p>
                  </div>
                  <div className="mt-6">
                    <Link href={`/blog/${post.slug}`} className="teaver-button text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 w-full text-center inline-block">
                      続きを読む
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center teaver-heading">カテゴリー</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/category/日本茶">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                日本茶
              </span>
            </Link>
            <Link href="/category/日本の食べ物">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                日本の食べ物
              </span>
            </Link>
            <Link href="/category/健康関連">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                健康関連
              </span>
            </Link>
            <Link href="/category/おもてなし">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                おもてなし
              </span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[#d4c4a8]/30 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#9ca3af] text-sm teaver-text">&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
