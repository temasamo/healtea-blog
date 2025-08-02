import type { AppProps } from 'next/app'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }: AppProps) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  // デバッグ情報を出力
  console.log('=== Google Analytics Debug Info ===');
  console.log('GA_ID:', GA_ID);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'Server side');

  return (
    <>
      {/* Google tag (gtag.js) */}
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
            onLoad={() => {
              console.log('✅ Google Analytics script loaded successfully');
            }}
            onError={(e) => {
              console.error('❌ Google Analytics script failed to load:', e);
            }}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              console.log('🚀 Starting Google Analytics initialization...');
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                debug_mode: ${process.env.NODE_ENV === 'development' ? 'true' : 'false'},
                send_page_view: true
              });
              console.log('✅ Google Analytics initialized with ID: ${GA_ID}');
              console.log('📍 Current page path:', window.location.pathname);
              console.log('🌐 Current URL:', window.location.href);
              
              // 手動でページビューを送信
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
              });
              console.log('📊 Page view event sent');
            `}
          </Script>
        </>
      ) : (
        <Script id="ga-debug" strategy="afterInteractive">
          {`
            console.error('❌ NEXT_PUBLIC_GA_ID is not defined!');
            console.log('Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
          `}
        </Script>
      )}

      <Component {...pageProps} />
    </>
  )
}
