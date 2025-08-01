import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import type { Metadata } from 'next';

const TeaLeaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="#8b7355"/>
    <path d="M12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8Z" fill="#8b7355"/>
    <path d="M12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14Z" fill="#8b7355"/>
  </svg>
);

export const metadata: Metadata = {
  title: "HealTea - 차로 전달하는 자연의 힘",
  description: "HealTea는 엄선된 유기농 찻잎을 사용하여 여러분의 건강과 마음의 평온을 지원합니다. 전통적인 제조법과 현대 기술을 융합한 최고 품질의 차를 제공합니다.",
  keywords: "차, 녹차, 허브티, 디톡스, 건강, 미용, 유기농 찻잎",
  authors: [{ name: "HealTea" }],
  openGraph: {
    title: "HealTea - 차로 전달하는 자연의 힘",
    description: "엄선된 유기농 찻잎을 사용한 건강과 미용을 지원하는 차 브랜드",
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["ja_JP", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealTea - 차로 전달하는 자연의 힘",
    description: "엄선된 유기농 찻잎을 사용한 건강과 미용을 지원하는 차 브랜드",
  },
  alternates: {
    canonical: "https://healtea.com/ko",
    languages: {
      "ja": "https://healtea.com",
      "en": "https://healtea.com/en",
      "ko": "https://healtea.com/ko",
    },
  },
};

function getPosts() {
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
    
    // Ensure tags is always an array
    const tags = Array.isArray(data.tags) ? data.tags : [];
    
    return {
      slug: slug,
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      categories: data.categories || [],
      tags: tags,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return posts.slice(0, 3); // Get latest 3 posts
}

export default function KoreanHomePage() {
  const posts = getPosts();

  // Korean translations for the latest articles
  const koreanTranslations = {
    "2025-07-30-tea-cultivation-process": {
      title: "차는 어떻게 만들어질까요? 재배부터",
      description: "차의 재배 과정부터 제조까지, 일본차의 전통적인 제조법을 소개합니다."
    },
    "2025-07-29-omotenashi-history": {
      title: "오모테나시 문화의 기원과 정신",
      description: "일본만의 독특한 '오모테나시' 문화의 기원과 그 정신적 배경에 대해 역사적 관점에서 살펴봅니다."
    },
    "2025-07-29-nihoncha-history": {
      title: "일본차의 역사: 차는 어디서 왔을까요?",
      description: "일본차의 역사를 통해 차 문화가 어떻게 발전해왔는지 알아봅니다."
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f6f3] to-[#f5f2ed] text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#e5e7eb] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TeaLeaf />
              <h1 className="text-2xl font-light tracking-[0.15em] teaver-heading">HealTea</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                일본어
              </Link>
              <Link href="/en" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                English
              </Link>
              <span className="text-[#a67c52] font-medium text-sm">한국어</span>
              <Link href="/tw" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                繁體中文
              </Link>
              <Link href="/hk" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                香港繁體
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-light mb-8 tracking-[0.15em] teaver-heading leading-tight">
            차와 건강의 블로그
          </h2>
          <p className="text-xl text-[#6b7280] max-w-3xl mx-auto teaver-text leading-relaxed">
            차와 건강을 메인 테마로, 차의 역사, 일본 요리・료칸・오모테나시, 건강검진 등의 정보를 발신합니다. 
            (인스타・틱톡 연동도 향후 예정)
          </p>
        </div>

        {/* Latest Articles */}
        <section className="mb-16">
          <h3 className="text-3xl font-light mb-12 text-center tracking-[0.15em] teaver-heading">최신 기사</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const translation = koreanTranslations[post.slug as keyof typeof koreanTranslations];
              return (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="p-8 flex flex-col justify-between h-full">
                    <div>
                      <div className="mb-4 text-xs text-[#9ca3af] flex items-center gap-2 flex-wrap">
                        <span>{post.date}</span>
                        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                          <>
                            <span>・</span>
                            {post.tags.map((tag: string) => (
                              <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] rounded-full px-3 py-1 text-xs mr-1">{tag}</span>
                            ))}
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-medium mb-3 teaver-heading leading-relaxed group-hover:text-[#8b7355] transition-colors">
                        {translation?.title || post.title}
                      </h3>
                      <p className="text-[#6b7280] mb-4 teaver-text line-clamp-3">
                        {translation?.description || post.description || ''}
                      </p>
                    </div>
                    <div className="text-[#8b7355] text-sm font-medium group-hover:text-[#a67c52] transition-colors">
                      더 읽기 →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h3 className="text-3xl font-light mb-12 text-center tracking-[0.15em] teaver-heading">카테고리</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/category/日本茶" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">🍵</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">일본차</h4>
            </Link>
            <Link 
              href="/category/日本の食べ物" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">🍜</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">일본 요리</h4>
            </Link>
            <Link 
              href="/category/健康関連" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">💚</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">건강 관련</h4>
            </Link>
            <Link 
              href="/category/おもてなし" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">🏮</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">오모테나시</h4>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e7eb] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#6b7280] teaver-text">
            © 2025 HealTea. 모든 권리 보유.
          </p>
        </div>
      </footer>
    </div>
  );
} 