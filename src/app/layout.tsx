import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealTea Blog - 日本茶と文化の知恵を共有",
  description: "日本茶の歴史、健康効果、おもてなし文化、日本農業など、日本茶に関する豊富な知識と文化をブログ形式でお届けします。",
  keywords: "日本茶, 緑茶, 茶道, おもてなし, 日本文化, 健康, ブログ",
  authors: [{ name: "HealTea" }],
  openGraph: {
    title: "HealTea Blog - 日本茶と文化の知恵を共有",
    description: "日本茶の歴史、健康効果、おもてなし文化、日本農業など、日本茶に関する豊富な知識と文化をブログ形式でお届けします。",
    type: "website",
    locale: "ja_JP",
    alternateLocale: "en_US",
    images: [
      {
        url: "https://reset-tea.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HealTea Blog - Japanese Tea Culture and Wisdom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealTea Blog - 日本茶と文化の知恵を共有",
    description: "日本茶の歴史、健康効果、おもてなし文化、日本農業など、日本茶に関する豊富な知識と文化をブログ形式でお届けします。",
  },
  alternates: {
    canonical: "https://reset-tea.com",
    languages: {
      "ja": "https://reset-tea.com",
      "en": "https://reset-tea.com/en",
      "ko": "https://reset-tea.com/ko",
      "zh-TW": "https://reset-tea.com/tw",
      "zh-HK": "https://reset-tea.com/hk",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="alternate" hrefLang="ja" href="https://reset-tea.com" />
        <link rel="alternate" hrefLang="en" href="https://reset-tea.com/en" />
        <link rel="alternate" hrefLang="ko" href="https://reset-tea.com/ko" />
        <link rel="alternate" hrefLang="zh-TW" href="https://reset-tea.com/tw" />
        <link rel="alternate" hrefLang="zh-HK" href="https://reset-tea.com/hk" />
        <link rel="alternate" hrefLang="x-default" href="https://reset-tea.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
