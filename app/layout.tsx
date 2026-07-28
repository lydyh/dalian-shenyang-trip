import type { Metadata } from "next";
import "./globals.css";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = repoName ? `/${repoName}` : "";

export const metadata: Metadata = {
  title: "海风作序，盛京收尾｜大连沈阳 7 日旅行手册",
  description: "8 月 4 日至 10 日的大连沈阳手机旅行攻略：逐餐安排、顺路地图、甜品线索、洗浴对比和返京方案。",
  metadataBase: new URL("https://lydyh.github.io/dalian-shenyang-trip/"),
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title: "海风作序，盛京收尾｜大连 → 沈阳 7 日慢游",
    description: "逐餐不绕路、甜品有出处、¥200–300 洗浴对比，一页随身查看。",
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
