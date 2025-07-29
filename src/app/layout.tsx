import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealTea - 自然の力をお茶で届ける",
  description: "HealTeaは、厳選された有機茶葉を使用し、あなたの健康と心の安らぎをサポートします。伝統的な製法と現代の技術を融合させた、最高品質のお茶をお届けします。",
  keywords: "お茶, 緑茶, ハーブティー, デトックス, 健康, 美容, 有機茶葉",
  authors: [{ name: "HealTea" }],
  openGraph: {
    title: "HealTea - 自然の力をお茶で届ける",
    description: "厳選された有機茶葉を使用した、健康と美容をサポートするお茶ブランド",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
