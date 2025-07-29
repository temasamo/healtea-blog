import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TranslateButton from '../../../components/TranslateButton';


const TeaLeaf = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="18" rx="10" ry="18" fill="#A3C585" />
    <path d="M18 36C18 24 18 12 18 0" stroke="#6B8E23" strokeWidth="2" />
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
  return files.map((file) => ({ slug: file.replace(/\\.md$/, '').replace(/\.md$/, '') }));
}

async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  return { ...(data as any), contentHtml };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white/90 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-center items-center h-20 gap-6">
          <TeaLeaf />
          <span className="text-3xl font-bold tracking-tight text-center">HealTea</span>
          <TeaLeaf />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-10 mx-auto">
          <div className="mb-6">
            <a href="/" className="inline-block text-green-700 hover:text-green-900 font-medium text-base transition-colors px-2 py-1 rounded hover:bg-green-50">
              ← ブログ一覧へ
            </a>
          </div>
          {post.image && (
            <div className="mb-6">
              <Image src={post.image} alt={post.title} width={800} height={400} className="rounded-xl object-cover w-full h-64" />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="text-gray-400 text-sm mb-4 flex gap-2 flex-wrap">
            <span>{post.date}</span>
            {post.tags && post.tags.length > 0 && (
              <span>・</span>
            )}
            {post.tags && post.tags.map((tag: string, i: number) => (
              <span key={tag} className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-xs mr-1">{tag}</span>
            ))}
          </div>
          <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          
          {/* デバッグ用テストボタン */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">デバッグ: 翻訳ボタンが表示されるはずです</p>
            <TranslateButton title={post.title} content={post.contentHtml} />
          </div>
        </article>
      </main>
      <footer className="bg-white border-t border-gray-200 py-8 mt-12 text-center text-gray-400 text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 