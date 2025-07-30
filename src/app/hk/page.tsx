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
  title: "HealTea - 用茶葉傳遞自然的力量",
  description: "HealTea使用嚴選的有機茶葉，為您的健康和心靈平靜提供支持。融合傳統製法與現代技術，提供最高品質的茶品。",
  keywords: "茶葉, 綠茶, 草本茶, 排毒, 健康, 美容, 有機茶葉",
  authors: [{ name: "HealTea" }],
  openGraph: {
    title: "HealTea - 用茶葉傳遞自然的力量",
    description: "使用嚴選有機茶葉的健康與美容支持茶品牌",
    type: "website",
    locale: "zh_HK",
    alternateLocale: ["ja_JP", "en_US", "ko_KR", "zh_TW"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealTea - 用茶葉傳遞自然的力量",
    description: "使用嚴選有機茶葉的健康與美容支持茶品牌",
  },
  alternates: {
    canonical: "https://healtea.com/hk",
    languages: {
      "ja": "https://healtea.com",
      "en": "https://healtea.com/en",
      "ko": "https://healtea.com/ko",
      "zh-TW": "https://healtea.com/tw",
      "zh-HK": "https://healtea.com/hk",
    },
  },
};

function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    // Ensure tags is always an array
    const tags = Array.isArray(data.tags) ? data.tags : [];
    
    return {
      slug: filename.replace(/\.md$/, ''),
      ...(data as Record<string, unknown>),
      tags: tags,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return posts.slice(0, 3); // Get latest 3 posts
}

export default function HongKongHomePage() {
  const posts = getPosts();

  // Hong Kong translations for the latest articles
  const hongKongTranslations = {
    "2025-07-30-tea-cultivation-process": {
      title: "茶葉是如何製作的？從栽培開始",
      description: "從茶葉的栽培過程到製作，介紹日本茶的傳統製法。"
    },
    "2025-07-29-omotenashi-history": {
      title: "款待文化的起源與精神",
      description: "從歷史角度探討日本獨特的「款待」文化起源及其精神背景。"
    },
    "2025-07-29-nihoncha-history": {
      title: "日本茶的歷史：茶葉從哪裡來？",
      description: "透過日本茶的歷史，了解茶文化是如何發展而來的。"
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
                日本語
              </Link>
              <Link href="/en" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                English
              </Link>
              <Link href="/ko" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                한국어
              </Link>
              <Link href="/tw" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors">
                繁體中文
              </Link>
              <span className="text-[#a67c52] font-medium text-sm">香港繁體</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-light mb-8 tracking-[0.15em] teaver-heading leading-tight">
            茶葉與健康的部落格
          </h2>
          <p className="text-xl text-[#6b7280] max-w-3xl mx-auto teaver-text leading-relaxed">
            以茶葉與健康為主要主題，發送茶葉歷史、日本料理・旅館・款待、健康檢查等資訊。
            （Instagram・TikTok連結也預計在未來推出）
          </p>
        </div>

        {/* Latest Articles */}
        <section className="mb-16">
          <h3 className="text-3xl font-light mb-12 text-center tracking-[0.15em] teaver-heading">最新文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const translation = hongKongTranslations[post.slug as keyof typeof hongKongTranslations];
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
                      繼續閱讀 →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h3 className="text-3xl font-light mb-12 text-center tracking-[0.15em] teaver-heading">分類</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/category/日本茶" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">🍵</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">日本茶</h4>
            </Link>
            <Link 
              href="/category/日本の食べ物" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">🍜</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">日本料理</h4>
            </Link>
            <Link 
              href="/category/健康関連" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">💚</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">健康相關</h4>
            </Link>
            <Link 
              href="/category/おもてなし" 
              className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="text-2xl mb-3">🏮</div>
              <h4 className="font-medium teaver-heading group-hover:text-[#8b7355] transition-colors">款待</h4>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e7eb] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#6b7280] teaver-text">
            © 2025 HealTea. 版權所有。
          </p>
        </div>
      </footer>
    </div>
  );
} 