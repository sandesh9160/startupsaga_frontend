import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { cache, Suspense } from "react";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { WebSiteSchema } from "@/components/seo/Schema/WebSiteSchema";
import { getSEOSettings, getLayoutSettings } from "@/lib/api";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { SITE_URL } from "@/config/site";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

// ── Deduplicate across generateMetadata + child server components ──
// React cache() ensures only ONE fetch per request lifecycle, even when
// called from generateMetadata AND GoogleAnalytics/Layout within the
// same render pass.
const getCachedSEO = cache(() => getSEOSettings().catch(() => ({})));
const getCachedLayout = cache(() => getLayoutSettings().catch(() => ({})));

// Re-export so Layout.tsx can import the same cached fetcher
export { getCachedSEO, getCachedLayout };

export async function generateMetadata(): Promise<Metadata> {
    const [layout, seo] = await Promise.all([
        getCachedLayout(),
        getCachedSEO(),
    ]);

    const siteName = layout.site_name || "StartupSaga.in";
    const rawTitle = seo.default_meta_title || `${siteName} | Startup Stories of India`;
    const rawDescription = seo.default_meta_description || "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.";
    const favicon = layout.site_favicon || "/favicon.png";

    // Strip any accidental HTML tags from CMS fields to avoid breaking the head
    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        keywords: seo.global_keywords,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: "/",
        },
        ...(seo.google_site_verification && {
            verification: {
                google: seo.google_site_verification,
            }
        }),
        openGraph: {
            title,
            description,
            url: SITE_URL,
            siteName: layout.site_name || "StartupSaga.in",
            type: "website",
            images: [
                {
                    url: layout.site_logo || "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: layout.site_name || "StartupSaga.in",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [layout.site_logo || "/og-image.jpg"],
        },
        icons: {
            icon: favicon,
            shortcut: favicon,
            apple: favicon,
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Preconnect to API origin so image/data requests don't pay TCP+TLS setup cost */}
                <link rel="preconnect" href="https://api.startupsaga.in" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://api.startupsaga.in" />
                {/* Preconnect for Google Fonts (already loaded via next/font but helps for fallback) */}
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`} suppressHydrationWarning>
                <Providers>
                    <Suspense fallback={null}>
                        <GoogleAnalytics />
                    </Suspense>
                    <WebSiteSchema />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
