import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingCTA } from "@/components/shared/floating-cta";
import { PurchaseNotification } from "@/components/shared/purchase-notification";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "paint by number",
    "personalized art",
    "AI art",
    "custom painting",
    "photo to painting",
    "paint by numbers kit",
    "personalized gift",
    "wedding gift",
    "pet portrait",
    "family portrait painting",
  ],
  authors: [{ name: "Canvasify" }],
  creator: "Canvasify",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Canvasify" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@canvasifyart",
    creator: "@canvasifyart",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#060816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_CONFIG.name,
              url: SITE_CONFIG.url,
              description: SITE_CONFIG.description,
              contactPoint: {
                "@type": "ContactPoint",
                email: SITE_CONFIG.email,
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <SmoothScroll>
          <div className="noise-overlay" aria-hidden="true" />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
          <FloatingCTA />
          <PurchaseNotification />
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#0D1323",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
              },
            }}
          />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
