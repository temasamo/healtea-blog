import { useCallback } from 'react';
import { event } from '@/lib/gtag';

export const useAnalytics = () => {
  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    event({
      action,
      category,
      label,
      value,
    });
  }, []);

  const trackPageView = useCallback((url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_location: url,
      });
    }
  }, []);

  const trackArticleView = useCallback((articleTitle: string, category: string) => {
    trackEvent('article_view', 'engagement', articleTitle);
  }, [trackEvent]);

  const trackLanguageSwitch = useCallback((language: string) => {
    trackEvent('language_switch', 'user_interaction', language);
  }, [trackEvent]);

  const trackCategoryClick = useCallback((categoryName: string) => {
    trackEvent('category_click', 'navigation', categoryName);
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackArticleView,
    trackLanguageSwitch,
    trackCategoryClick,
  };
}; 