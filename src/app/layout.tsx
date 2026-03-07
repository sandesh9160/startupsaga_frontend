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

    const siteName = layout?.site_name || "StartupSaga.in";
    const rawTitle = seo?.default_meta_title || `${siteName} | Startup Stories of India`;
    const rawDescription = seo?.default_meta_description || "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.";
    const favicon = layout?.site_favicon || "/favicon.png";

    // Strip any accidental HTML tags from CMS fields to avoid breaking the head


    const title = (rawTitle || "").replace(/<[^>]*>?/gm, '') || siteName;
    const description = (rawDescription || "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.").replace(/<[^>]*>?/gm, '');

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: title,
            template: `%s | ${siteName}`,
        },
        description,
        keywords: seo?.global_keywords,
        robots: {
            index: true,
            follow: true,
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
            siteName: siteName,
            type: "website",
            images: [
                {
                    url: layout.site_logo || "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: siteName,
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

/**
 * Internal component to handle data-dependent head elements.
 * Moving this out of RootLayout prevents the initial HTML shell from being blocked.
 */
async function HeadData() {
    const [layout, seo] = await Promise.all([
        getCachedLayout(),
        getCachedSEO(),
    ]);

    return (
        <>
            <WebSiteSchema
                name={layout?.site_name}
                description={seo?.default_meta_description}
                logoUrl={layout?.site_logo}
            />

            {/* Google Analytics - Injected once data resolves */}
            {seo?.google_analytics_id && (
                <GoogleAnalytics gaId={seo.google_analytics_id} />
            )}
        </>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
            <head>
                {/* Critical CSS for FCP: ensuring basic theme tokens are present before CSS loads */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --background: 0 0% 100%;
                        --foreground: 222.2 84% 4.9%;
                        --primary: 221.2 83.2% 53.3%;
                        --accent: 12 88% 59%;
                        --font-inter: 'Inter', sans-serif;
                        --font-playfair: 'Playfair Display', serif;
                    }
                    body { background: #FFFFFF; font-family: 'Inter', sans-serif; color: #0F172A; }
                    .container-wide { width: 100%; max-width: 1440px; margin-left: auto; margin-right: auto; padding-left: 1.5rem; padding-right: 1.5rem; }
                    h1 { font-family: 'Playfair Display', serif; line-height: 1.1; letter-spacing: -0.02em; font-weight: 600; }
                    @media (min-width: 768px) { h1 { font-size: 3rem; } .container-wide { padding-left: 2rem; padding-right: 2rem; } }
                    @media (min-width: 1024px) { h1 { font-size: 4.5rem; } }
                `}} />

                {/* Preconnect to API origin so image/data requests don't pay TCP+TLS setup cost */}
                <link rel="preconnect" href="https://api.startupsaga.in" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://api.startupsaga.in" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                <Suspense fallback={null}>
                    <HeadData />
                </Suspense>
            </head>
            <body className="font-sans antialiased" suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
