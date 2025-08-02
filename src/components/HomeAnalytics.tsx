'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface HomeAnalyticsProps {
  currentLang: string;
}

export default function HomeAnalytics({ currentLang }: HomeAnalyticsProps) {
  const { trackLanguageSwitch } = useAnalytics();

  useEffect(() => {
    // ページ読み込み時に言語情報を送信
    if (currentLang !== 'ja') {
      trackLanguageSwitch(currentLang);
    }
  }, [currentLang, trackLanguageSwitch]);

  return null; // このコンポーネントは表示されません
} 