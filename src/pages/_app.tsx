import type { AppProps } from 'next/app'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }: AppProps) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      {/* Google tag (gtag.js) */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
            onLoad={() => {
              console.log('Google Analytics script loaded');
            }}
            onError={(e) => {
              console.error('Google Analytics script failed to load:', e);
            }}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                debug_mode: ${process.env.NODE_ENV === 'development' ? 'true' : 'false'},
                send_page_view: true
              });
              console.log('Google Analytics initialized with ID: ${GA_ID}');
              console.log('Current page path:', window.location.pathname);
              
              // 手動でページビューを送信
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
              });
            `}
          </Script>
        </>
      )}

      <Component {...pageProps} />
    </>
  )
}
