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
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                debug_mode: ${process.env.NODE_ENV === 'development' ? 'true' : 'false'}
              });
              console.log('Google Analytics initialized with ID: ${GA_ID}');
            `}
          </Script>
        </>
      )}

      <Component {...pageProps} />
    </>
  )
}
