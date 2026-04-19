import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1628" },
  ],
};

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  title: {
    default: "Studently – Better Infinite Campus Dashboard | Educational Tool",
    template: "%s | Studently",
  },
  description:
    "Studently is a free educational Chrome extension that improves Infinite Campus with a clean, modern student dashboard for tracking grades, assignments, and GPA. Built for educational purposes to help students succeed academically.",
  keywords: [
    "Infinite Campus",
    "student dashboard",
    "grades tracker",
    "Chrome extension",
    "Studently",
    "Infinite Campus alternative UI",
    "student grade tracker",
    "better way to view grades",
    "educational tool",
    "student productivity",
    "GPA calculator",
    "academic tracker",
    "school grades",
    "high school",
    "student success",
    "grade monitoring",
    "education technology",
    "edtech",
    "free student tool",
    "Infinite Campus extension",
    "assignment tracker",
    "classroom grades",
    "report card viewer",
  ],
  authors: [{ name: "Studently", url: "https://studently.website" }],
  creator: "Studently",
  publisher: "Studently",
  category: "education",
  classification: "Educational Software",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "Studently",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studently.website",
    siteName: "Studently",
    title: "Studently – Better Infinite Campus Dashboard | Free Educational Tool",
    description:
      "A free educational Chrome extension that improves Infinite Campus with a clean, modern student dashboard for tracking grades, assignments, and GPA. Designed for educational purposes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Studently – Better Infinite Campus Dashboard for Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studently – Better Infinite Campus Dashboard",
    description:
      "Free educational Chrome extension that gives students a modern dashboard for Infinite Campus. Track grades, assignments, and GPA with ease.",
    images: ["/og-image.png"],
    creator: "@studently",
  },
  alternates: {
    canonical: "https://studently.website",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Studently",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "none",
    "subject": "Educational Chrome Extension for Students",
    "rating": "General",
    "distribution": "Global",
    "target": "all",
    "audience": "Students, Educators, Parents",
    "coverage": "Worldwide",
    "revisit-after": "7 days",
    "dc.title": "Studently – Educational Infinite Campus Dashboard",
    "dc.creator": "Studently",
    "dc.subject": "Education, Student Tools, Grade Tracking",
    "dc.description":
      "Free educational tool that enhances Infinite Campus for students",
    "dc.language": "en",
    "dc.type": "Software",
    "educational-purpose":
      "This website and Chrome extension are designed for educational purposes only. Studently helps students track their academic progress by providing a modern interface for Infinite Campus.",
    "intended-audience": "K-12 Students, High School Students, College Students",
  },
  metadataBase: new URL("https://studently.website"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Studently",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Chrome",
  browserRequirements: "Google Chrome",
  url: "https://studently.website",
  description:
    "A free educational Chrome extension that enhances Infinite Campus with a modern student dashboard for tracking grades, assignments, and GPA.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Organization",
    name: "Studently",
    url: "https://studently.website",
  },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  educationalUse: "Academic grade tracking and assignment management",
  learningResourceType: "Tool",
  isAccessibleForFree: true,
  inLanguage: "en",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Studently",
  url: "https://studently.website",
  description:
    "Studently builds free educational tools for students to better track academic progress.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@studently.app",
    contactType: "customer support",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Studently",
  url: "https://studently.website",
  description:
    "Free educational Chrome extension for a better Infinite Campus student dashboard.",
  publisher: {
    "@type": "Organization",
    name: "Studently",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 text-center text-xs text-accent font-medium">
            This tool is designed for educational purposes — helping students track grades and academic progress.
          </div>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
