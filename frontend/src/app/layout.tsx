import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: {
    default: "Studently – Better Infinite Campus Dashboard",
    template: "%s | Studently",
  },
  description:
    "A Chrome extension that improves Infinite Campus with a clean, modern student dashboard for tracking grades and assignments.",
  keywords: [
    "Infinite Campus",
    "student dashboard",
    "grades tracker",
    "Chrome extension",
    "Studently",
    "Infinite Campus alternative UI",
    "student grade tracker",
    "better way to view grades",
  ],
  authors: [{ name: "Studently" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studently.app",
    siteName: "Studently",
    title: "Studently – Better Infinite Campus Dashboard",
    description:
      "A Chrome extension that improves Infinite Campus with a clean, modern student dashboard for tracking grades and assignments.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Studently – Better Infinite Campus Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studently – Better Infinite Campus Dashboard",
    description:
      "A Chrome extension that improves Infinite Campus with a clean, modern student dashboard for tracking grades and assignments.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://studently.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
