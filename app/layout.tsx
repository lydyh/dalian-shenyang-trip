import type { Metadata } from "next";
import "./globals.css";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = repoName ? `/${repoName}` : "";

export const metadata: Metadata = {
  title: "从海风到盛京｜大连沈阳旅行手册",
  description: "一份为手机准备的大连沈阳四日交互旅行攻略，包含路线地图、替换方案、导航和旅行清单。",
  metadataBase: new URL("https://lydyh.github.io/dalian-shenyang-trip/"),
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title: "从海风到盛京｜大连 → 沈阳 4日慢游",
    description: "海岸线、西塔、特色美食、甜品与最后一天洗浴，一页随身查看。",
    images: [`${basePath}/og.svg`],
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
