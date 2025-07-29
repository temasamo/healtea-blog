import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Metadata } from 'next';

const TeaLeaf = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="16" rx="8" ry="14" fill="#8b7355" opacity="0.8" />
    <path d="M16 30C16 20 16 10 16 2" stroke="#a67c52" strokeWidth="1.5" />
  </svg>
);

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const category = decodeURIComponent(categoryParam);
  return {
    title: `${category} - HealTea`,
    description: `${category}に関する記事一覧`,
  };
}

export async function generateStaticParams() {
  const categories = ['日本茶', '日本の食べ物', '健康関連', 'おもてなし'];
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

function getPostsByCategory(category: string) {
  const dir = path.join(process.cwd(), 'src/content/blog');
  const files = fs.readdirSync(dir);
  
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(dir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const slug = file.replace('.md', '');
      
      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        image: data.image,
        categories: data.categories || [],
        tags: data.tags || [],
      };
    })
    .filter((post) => post.categories.includes(category))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return posts;
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryParam } = await params;
  const category = decodeURIComponent(categoryParam);
  const posts = getPostsByCategory(category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f6f3] to-[#f5f2ed] text-[#2c2c2c]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d4c4a8]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex justify-center items-center h-24 gap-8">
          <TeaLeaf />
          <span className="text-4xl font-light tracking-wider text-center teaver-heading">HealTea</span>
          <TeaLeaf />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <a href="/" className="inline-block text-[#8b7355] hover:text-[#a67c52] font-medium text-base transition-colors px-3 py-2 rounded-full hover:bg-[#f3f4f6] teaver-text">
            ← ホームへ戻る
          </a>
        </div>
        
        <h1 className="text-5xl font-light text-center mb-16 teaver-heading">{category}</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6b7280] text-xl teaver-text">このカテゴリーの記事はまだありません。</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="teaver-card rounded-2xl overflow-hidden h-full">
                {post.image && (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <h2 className="text-xl font-medium mb-3 teaver-heading leading-relaxed">{post.title}</h2>
                  <p className="text-[#9ca3af] text-sm mb-4">{post.date}</p>
                  <p className="text-[#6b7280] mb-6 teaver-text line-clamp-3">{post.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags && post.tags.map((tag: string) => (
                      <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="teaver-button text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 w-full text-center inline-block">
                    続きを読む
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[#d4c4a8]/30 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#9ca3af] text-sm teaver-text">&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 