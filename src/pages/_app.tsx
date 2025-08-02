import type { AppProps } from 'next/app'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <Component {...pageProps} />
    </>
  )
}
