import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "sonner"
import ScrollProgress from "@/components/scroll-progress"
import { ThemeProvider } from "@/components/theme-provider"
import PageProgress from "@/components/page-progress"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://hamzatahir.dev"),
  title: {
    default: "Hamza Tahir - Full-Stack Developer & WordPress Expert",
    template: "%s | Hamza Tahir",
  },
  description:
    "Professional full-stack WordPress and Shopify developer creating stunning, high-performance websites and e-commerce solutions. Expert in React, Next.js, and modern web technologies.",
  keywords: [
    "Full-Stack Developer",
    "WordPress Developer",
    "Shopify Developer",
    "React Developer",
    "Next.js Developer",
    "Web Development",
    "E-commerce Development",
    "Frontend Developer",
    "Backend Developer",
    "JavaScript Developer",
  ],
  authors: [{ name: "Hamza Tahir", url: "https://hamzatahir.dev" }],
  creator: "Hamza Tahir",
  publisher: "Hamza Tahir",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hamzatahir.dev",
    siteName: "Hamza Tahir - Full-Stack Developer",
    title: "Hamza Tahir - Full-Stack Developer & WordPress Expert",
    description:
      "Professional full-stack WordPress and Shopify developer creating stunning, high-performance websites and e-commerce solutions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hamza Tahir - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamza Tahir - Full-Stack Developer & WordPress Expert",
    description:
      "Professional full-stack WordPress and Shopify developer creating stunning, high-performance websites and e-commerce solutions.",
    images: ["/og-image.jpg"],
    creator: "@hamzatahir",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://hamzatahir.dev",
  },
  category: "technology",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preload" href="/hero-bg.jpg" as="image" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <PageProgress />
            <ScrollProgress />
            {children}
            <Toaster position="top-right" />
            <Analytics />
            <SpeedInsights />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
