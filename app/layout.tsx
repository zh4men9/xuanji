import type { Metadata } from "next";
import { Providers } from './providers';
import "./globals.css";

export const metadata: Metadata = {
  title: "玄机 - AI算命系统",
  description: "基于 Gemini 的智能算命系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
