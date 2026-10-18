import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese", "latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Little Sky for You — 20.10",
  description:
    "Một bầu trời nhỏ dành riêng cho em — lời chúc Ngày Phụ nữ Việt Nam 20/10 từ sốp, gửi khách VIP.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "A Little Sky for You — 20.10",
    description:
      "Một bầu trời nhỏ dành riêng cho em — lời chúc Ngày Phụ nữ Việt Nam 20/10.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080d1b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
