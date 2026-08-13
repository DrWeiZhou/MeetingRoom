import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "会议室预定系统", template: "%s · 会议室预定系统" },
  description: "具身智能与机器人研究院会议室预定系统",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#087c68" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geist.variable} ${geistMono.variable} font-[family-name:var(--font-geist)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
