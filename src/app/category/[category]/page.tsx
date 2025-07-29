import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Metadata } from 'next';

const TeaLeaf = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="18" rx="10" ry="18" fill="#A3C585" />
    <path d="M18 36C18 24 18 12 18 0" stroke="#6B8E23" strokeWidth="2" />
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800">
      <header className="bg-white/90 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-center items-center h-20 gap-6">
          <TeaLeaf />
          <span className="text-3xl font-bold tracking-tight text-center">HealTea</span>
          <TeaLeaf />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <a href="/" className="inline-block text-green-700 hover:text-green-900 font-medium text-base transition-colors px-2 py-1 rounded hover:bg-green-50">
            ← ホームへ戻る
          </a>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8">{category}</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">このカテゴリーの記事はまだありません。</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
                {post.image && (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{post.date}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{post.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.map((tag: string) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    続きを読む
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-12 text-center text-gray-400 text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 