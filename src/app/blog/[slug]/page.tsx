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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) return {};
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
  const dir = path.join(process.cwd(), 'src/content/blog');
  const files = fs.readdirSync(dir);
  return files.map((file) => ({ slug: file.replace(/\.md$/, '').replace(/\.md$/, '') }));
}

async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  return { ...(data as Record<string, unknown>), contentHtml };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f6f3] to-[#f5f2ed] text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d4c4a8]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex justify-center items-center h-24 gap-8">
          <TeaLeaf />
          <span className="text-5xl font-light tracking-[0.3em] text-center teaver-heading">HealTea</span>
          <TeaLeaf />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <article className="teaver-card rounded-2xl p-10 md:p-16 mx-auto">
          <div className="mb-10">
            <Link href="/" className="inline-block text-[#8b7355] hover:text-[#a67c52] font-medium text-base transition-colors px-4 py-3 rounded-full hover:bg-[#f3f4f6] teaver-text">
              ← ブログ一覧へ
            </Link>
          </div>

          {post.image && imageExists(post.image) && (
            <div className="mb-10">
              <Image 
                src={post.image} 
                alt={post.title} 
                width={800} 
                height={400} 
                className="rounded-2xl object-cover w-full h-96"
              />
            </div>
          )}

          <h1 className="text-5xl font-light mb-8 tracking-[0.15em] teaver-heading leading-relaxed">{post.title}</h1>
          
          <div className="text-[#9ca3af] text-sm mb-10 flex gap-3 flex-wrap items-center">
            <span>{post.date}</span>
            {post.tags && post.tags.length > 0 && (
              <span>・</span>
            )}
            {post.tags && Array.isArray(post.tags) && post.tags.map((tag: string) => (
              <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] rounded-full px-4 py-2 text-sm mr-2">{tag}</span>
            ))}
          </div>

          <div className="prose prose-lg prose-neutral max-w-none teaver-text leading-relaxed" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[#d4c4a8]/30 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#9ca3af] text-sm teaver-text">&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 