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
  title: "LASAGNA",
  description: "Get personalized cooking assistance and recipe recommendations powered by AI",
  openGraph: {
    title: "LASAGNA",
    description: "Get personalized cooking assistance and recipe recommendations powered by AI",
    url: "https://lasagna.vercel.app",
    siteName: "LASAGNA",
    images: [
      {
        url: "/lasagna.png",
        width: 1200,
        height: 630,
        alt: "LASAGNA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LASAGNA",
    description: "Get personalized cooking assistance and recipe recommendations powered by AI",
    images: ["/lasagna.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
