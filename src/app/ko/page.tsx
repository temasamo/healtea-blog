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

export default function KoreanHome() {
  // 記事一覧を取得（サブディレクトリも含む）
  function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else if (file.endsWith('.md')) {
        arrayOfFiles.push(fullPath);
      }
    });
    
    return arrayOfFiles;
  }
  
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const allFiles = getAllFiles(blogDir);
  
  const posts = allFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    // ファイル名からslugを生成（パスを含む）
    const relativePath = path.relative(blogDir, filePath);
    const slug = relativePath.replace(/\.md$/, '');
    
    // tagsを配列として確実に処理
    let tags = data.tags || [];
    if (typeof tags === 'string') {
      tags = [tags];
    } else if (!Array.isArray(tags)) {
      tags = [];
    }
    
    return {
      slug: slug,
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      categories: data.categories || [],
      tags: tags,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f6f3] to-[#f5f2ed] text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d4c4a8]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex justify-center items-center h-24 gap-8">
          <TeaLeaf />
          <span className="text-5xl font-light tracking-[0.3em] text-center teaver-heading">HealTea</span>
          <TeaLeaf />
        </div>
        {/* Language Switcher */}
        <div className="max-w-5xl mx-auto px-6 pb-4 flex justify-end">
          <div className="flex gap-2">
            <Link href="/" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors px-3 py-1 rounded-full hover:bg-[#f3f4f6]">
              日本語
            </Link>
            <Link href="/en" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors px-3 py-1 rounded-full hover:bg-[#f3f4f6]">
              English
            </Link>
            <span className="text-[#8b7355] font-medium text-sm px-3 py-1 rounded-full bg-[#f3f4f6]">
              한국어
            </span>
            <Link href="/tw" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors px-3 py-1 rounded-full hover:bg-[#f3f4f6]">
              繁體中文
            </Link>
            <Link href="/hk" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors px-3 py-1 rounded-full hover:bg-[#f3f4f6]">
              香港繁體
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-8 tracking-[0.15em] font-sans">
            차와 건강의<br />
            <span className="text-[#8b7355]">블로그</span>
          </h1>
          <p className="text-xl text-[#6b7280] mb-4 teaver-text max-w-3xl mx-auto">
            차와 건강을 주제로 차의 역사, 일본 요리・여관・오모테나시, 건강검진<br />
            등의 정보를 발신합니다.
          </p>
          <p className="text-sm text-[#9ca3af]">（인스타・틱톡 연동도 향후 예정）</p>
        </section>

        {/* Latest Articles */}
        <section className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center tracking-[0.1em] teaver-heading">최신 기사</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 6).map((post) => (
              <article key={post.slug} className="teaver-card rounded-2xl overflow-hidden h-full">
                <div className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="mb-4 text-xs text-[#9ca3af] flex items-center gap-2 flex-wrap">
                      <span>{post.date}</span>
                      {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
                        <>
                          <span>・</span>
                          {post.categories.map((category: string) => (
                            <span key={category} className="bg-green-600 text-white rounded-full px-3 py-1 text-xs mr-1">{category}</span>
                          ))}
                        </>
                      )}
                      {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                        <>
                          <span>・</span>
                          {post.tags.map((tag: string) => (
                            <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] rounded-full px-3 py-1 text-xs mr-1">{tag}</span>
                          ))}
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-medium mb-3 teaver-heading leading-relaxed">{post.title}</h3>
                    <p className="text-[#6b7280] mb-4 teaver-text line-clamp-3">{post.description || ''}</p>
                  </div>
                  <div className="mt-6">
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="teaver-button text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 w-full text-center inline-block">
                      더 읽기
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center tracking-[0.1em] teaver-heading">카테고리</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/category/japanese-tea" className="block">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                일본차
              </span>
            </Link>
            <Link href="/category/japanese-food" className="block">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                일본 요리
              </span>
            </Link>
            <Link href="/category/health" className="block">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                건강 관련
              </span>
            </Link>
            <Link href="/category/omotenashi" className="block">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                오모테나시
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