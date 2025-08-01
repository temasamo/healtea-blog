import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// 画像ファイルの存在をチェックする関数
function imageExists(imagePath: string): boolean {
  if (!imagePath) return false;
  const publicPath = path.join(process.cwd(), 'public', imagePath);
  return fs.existsSync(publicPath);
}

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

// slugから英語記事のファイルパスを取得する関数
function getEnglishFilePathFromSlug(slug: string): string | null {
  const blogDir = path.join(process.cwd(), 'src/content/blog/en');
  const allFiles = getAllEnglishFiles(blogDir);
  
  for (const filePath of allFiles) {
    const relativePath = path.relative(blogDir, filePath);
    const fileSlug = relativePath.replace(/\.md$/, '');
    if (fileSlug === slug) {
      return filePath;
    }
  }
  
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const filePath = getEnglishFilePathFromSlug(decodedSlug);
  if (!filePath || !fs.existsSync(filePath)) return {};
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  return {
    title: data.title,
    description: data.description || '',
    openGraph: {
      title: data.title,
      description: data.description || '',
      type: 'article',
      publishedTime: data.date,
      tags: data.tags,
      images: data.image ? [{ url: data.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description || '',
      images: data.image ? [data.image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'src/content/blog/en');
  if (!fs.existsSync(blogDir)) return [];
  
  const allFiles = getAllEnglishFiles(blogDir);
  
  return allFiles.map((filePath) => {
    const relativePath = path.relative(blogDir, filePath);
    const slug = relativePath.replace(/\.md$/, '');
    return { slug: encodeURIComponent(slug) };
  });
}

interface EnglishPost {
  slug: string;
  contentHtml: string;
  title: string;
  date: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  author: string;
  image?: string;
  lang?: string;
}

async function getEnglishPost(slug: string): Promise<EnglishPost | null> {
  const decodedSlug = decodeURIComponent(slug);
  const filePath = getEnglishFilePathFromSlug(decodedSlug);
  if (!filePath || !fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug: decodedSlug,
    contentHtml,
    ...data,
  } as EnglishPost;
}

export default async function EnglishBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getEnglishPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <Link href="/en" className="inline-flex items-center text-green-700 hover:text-green-800 mb-4">
            <TeaLeaf />
            <span className="ml-2 font-medium">← Back to English Blog</span>
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <span className="mr-4">📅 {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="mr-4">👤 {post.author}</span>
            </div>
            
            {post.categories && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category: string) => (
                  <span key={category} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            )}
            
            {post.description && (
              <p className="text-gray-700 text-lg leading-relaxed">{post.description}</p>
            )}
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="bg-white rounded-lg shadow-lg p-8">
          {post.image && imageExists(post.image) && (
            <div className="mb-8">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </main>

        {/* フッター */}
        <footer className="mt-8 text-center text-gray-600">
          <p>© 2025 HealTea Blog - English Edition</p>
        </footer>
      </div>
    </div>
  );
} 