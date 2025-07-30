import Image from "next/image";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import type { Metadata } from 'next';

const TeaLeaf = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="16" rx="8" ry="14" fill="#8b7355" opacity="0.8" />
    <path d="M16 30C16 20 16 10 16 2" stroke="#a67c52" strokeWidth="1.5" />
  </svg>
);

export const metadata: Metadata = {
  title: "HealTea - Tea & Health Blog",
  description: "Discovering the world of Japanese tea, cuisine, hospitality, and wellness. Explore the rich traditions and modern insights of Japanese culture.",
  keywords: "japanese tea, green tea, matcha, japanese cuisine, omotenashi, wellness, health, japanese culture",
  authors: [{ name: "HealTea" }],
  openGraph: {
    title: "HealTea - Tea & Health Blog",
    description: "Discovering the world of Japanese tea, cuisine, hospitality, and wellness",
    type: "website",
    locale: "en_US",
    alternateLocale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealTea - Tea & Health Blog",
    description: "Discovering the world of Japanese tea, cuisine, hospitality, and wellness",
  },
  alternates: {
    canonical: "https://healtea.com/en",
    languages: {
      "ja": "https://healtea.com",
      "en": "https://healtea.com/en",
    },
  },
};

export default function EnglishHome() {
  // 記事一覧を取得
  const dir = path.join(process.cwd(), 'src/content/blog');
  const files = fs.readdirSync(dir);
  const posts = files.map((file) => {
    const fileContents = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(fileContents);
    
    // tagsを配列として確実に処理
    let tags = data.tags || [];
    if (typeof tags === 'string') {
      tags = [tags];
    } else if (!Array.isArray(tags)) {
      tags = [];
    }
    
              return {
            slug: file.replace(/\.md$/, ''),
            ...(data as Record<string, unknown>),
            tags: tags,
          };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  // 英語版の記事タイトルと説明のマッピング
  const englishTranslations: { [key: string]: { title: string; description: string } } = {
    '2025-07-29-japanese-food-part1': {
      title: 'Top 10 Popular Japanese Foods Among International Travelers - Part 1 (Rankings 1-5)',
      description: 'Discover the most popular Japanese dishes among international tourists, featuring sushi, ramen, tempura, and more. Based on the latest 2024 survey.'
    },
    '2025-07-29-japanese-food-part2': {
      title: 'Top 10 Popular Japanese Foods Among International Travelers - Part 2 (Rankings 6-10)',
      description: 'Explore the second half of Japan\'s most beloved dishes among international visitors, from oyakodon to gyoza.'
    },
    '2025-07-29-japanese-food-part3': {
      title: 'Trending Japanese Foods That Are Gaining International Attention',
      description: 'Discover the latest trending Japanese dishes that are capturing the hearts of international food enthusiasts.'
    },
    '2025-07-29-green-tea-health-benefits': {
      title: 'Amazing Health Benefits of Green Tea: Nutrients and Their Effects',
      description: 'Learn about the key components in Japanese tea (catechins, theanine, caffeine) and their health impacts.'
    },
    '2025-07-29-nihoncha-history': {
      title: 'The History and Culture of Japanese Tea',
      description: 'Explore the rich history and cultural significance of Japanese tea from ancient times to modern day.'
    },
    '2025-07-29-omotenashi-history': {
      title: 'The Origins and Spirit of Japanese Omotenashi Culture',
      description: 'Discover the historical roots and spiritual background of Japan\'s unique omotenashi hospitality culture.'
    },
    '2025-07-30-tea-cultivation-process': {
      title: 'The Art of Japanese Tea Cultivation and Processing',
      description: 'Learn about the traditional methods and modern techniques used in Japanese tea cultivation and production.'
    }
  };

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
            <span className="text-[#8b7355] font-medium text-sm px-3 py-1 rounded-full bg-[#f3f4f6]">
              English
            </span>
            <Link href="/ko" className="text-[#8b7355] hover:text-[#a67c52] font-medium text-sm transition-colors px-3 py-1 rounded-full hover:bg-[#f3f4f6]">
              한국어
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-light mb-8 tracking-[0.15em] font-sans">
            Tea & Health<br />
            <span className="text-[#8b7355]">Blog</span>
          </h1>
          <p className="text-xl text-[#6b7280] mb-4 teaver-text max-w-3xl mx-auto">
            Discovering the world of Japanese tea, cuisine, hospitality, and wellness.<br />
            Exploring the rich traditions and modern insights of Japanese culture.
          </p>
          <p className="text-sm text-[#9ca3af]">(Instagram & TikTok integration coming soon)</p>
        </section>

        {/* Latest Articles */}
        <section className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center tracking-[0.1em] teaver-heading">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 6).map((post) => {
              const translation = englishTranslations[post.slug] || { title: post.title, description: post.description };
              return (
                <article key={post.slug} className="teaver-card rounded-2xl overflow-hidden h-full">
                  <div className="p-8 flex flex-col justify-between h-full">
                    <div>
                      <div className="mb-4 text-xs text-[#9ca3af] flex items-center gap-2 flex-wrap">
                        <span>{post.date}</span>
                        <span>・</span>
                        {post.tags && Array.isArray(post.tags) && post.tags.map((tag: string) => (
                          <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] rounded-full px-3 py-1 text-xs mr-1">{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-xl font-medium mb-3 teaver-heading leading-relaxed">{translation.title}</h3>
                      <p className="text-[#6b7280] mb-4 teaver-text line-clamp-3">{translation.description || ''}</p>
                    </div>
                    <div className="mt-6">
                      <Link href={`/blog/${post.slug}`} className="teaver-button text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 w-full text-center inline-block">
                        Read More
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center tracking-[0.1em] teaver-heading">Categories</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/category/日本茶">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                Japanese Tea
              </span>
            </Link>
            <Link href="/category/日本の食べ物">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                Japanese Cuisine
              </span>
            </Link>
            <Link href="/category/健康関連">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                Health & Wellness
              </span>
            </Link>
            <Link href="/category/おもてなし">
              <span className="teaver-card px-8 py-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-[#2c2c2c] font-medium text-lg text-center block teaver-heading">
                Omotenashi
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