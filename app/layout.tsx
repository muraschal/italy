import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://italy.rapold.io"),
  title: "Strada del Sud",
  description: "Tessin · Milano · Bergamo — 13.–17. August 2026",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Strada del Sud",
    description: "Tessin · Milano · Bergamo — 13.–17. August 2026",
    siteName: "Strada del Sud",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strada del Sud",
    description: "Tessin · Milano · Bergamo — 13.–17. August 2026",
  },
  other: {
    "apple-mobile-web-app-title": "Strada del Sud",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#06181f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`}>
      <body className="min-h-[100svh] bg-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
