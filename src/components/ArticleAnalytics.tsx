'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ArticleAnalyticsProps {
  title: string;
  category: string;
  slug: string;
}

export default function ArticleAnalytics({ title, category, slug }: ArticleAnalyticsProps) {
  const { trackArticleView } = useAnalytics();

  useEffect(() => {
    // 記事表示時にイベントを送信
    trackArticleView(title, category);
  }, [title, category, trackArticleView]);

  return null; // このコンポーネントは表示されません
} 