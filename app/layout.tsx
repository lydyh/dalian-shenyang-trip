import type { Metadata } from "next";
import "./globals.css";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = repoName ? `/${repoName}` : "";

export const metadata: Metadata = {
  title: "海风作序，盛京收尾｜大连沈阳 7 日旅行手册",
  description: "8 月 4 日至 10 日的大连沈阳手机旅行攻略：省力主线、预约标注、可替换地点与美食、洗浴对比和返京方案。",
  metadataBase: new URL("https://lydyh.github.io/dalian-shenyang-trip/"),
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title: "海风作序，盛京收尾｜大连 → 沈阳 7 日慢游",
    description: "路线不绕路、预约标注明确、备选一键替换，连同 ¥200–300 洗浴对比一页随身查看。",
    images: [`${basePath}/og.png`],
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
