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

// 英語記事のディレクトリ内のファイルを取得する関数
function getAllEnglishFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllEnglishFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md')) {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

interface EnglishPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  author: string;
  image?: string;
  lang?: string;
}

// 英語記事を取得する関数
function getEnglishPosts(): EnglishPost[] {
  const blogDir = path.join(process.cwd(), 'src/content/blog/en');
  if (!fs.existsSync(blogDir)) return [];
  
  const allFiles = getAllEnglishFiles(blogDir);
  
  const posts = allFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const relativePath = path.relative(blogDir, filePath);
    const slug = relativePath.replace(/\.md$/, '');
    
    return {
      slug,
      ...data,
    } as EnglishPost;
  });

  // 日付順にソート（新しい順）
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const metadata: Metadata = {
  title: 'HealTea Blog - English Edition',
  description: 'Discover the beauty of Japanese tea culture, hospitality, and traditions through our English blog posts.',
};

export default function EnglishBlogPage() {
  const posts = getEnglishPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-800 mb-6">
            <TeaLeaf />
            <span className="ml-2 font-medium">← Back to Japanese Blog</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HealTea Blog - English Edition
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the beauty of Japanese tea culture, hospitality, and traditions through our English blog posts.
          </p>
        </header>

        {/* 記事一覧 */}
        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href={`/en/blog/${encodeURIComponent(post.slug)}`}>
                {post.image && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <span className="mr-4">📅 {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                    <span>👤 {post.author}</span>
                  </div>
                  
                  {post.description && (
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  
                  {post.categories && (
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category: string) => (
                        <span key={category} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </main>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No English articles available yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
          </div>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center text-gray-600">
          <p>© 2025 HealTea Blog - English Edition</p>
          <p className="mt-2 text-sm">
            Exploring Japanese culture through the lens of tea and hospitality
          </p>
        </footer>
      </div>
    </div>
  );
} 