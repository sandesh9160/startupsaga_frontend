import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

import { getLayoutSettings, getSEOSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
    const [layout, seo] = await Promise.all([
        getLayoutSettings().catch(() => ({})),
        getSEOSettings().catch(() => ({})),
    ]);

    const title = seo.default_meta_title || "StartupSaga.in | Startup Stories of India";
    const description = seo.default_meta_description || "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.";
    const favicon = layout.site_favicon || "/favicon.png";

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        keywords: seo.global_keywords,
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const layout = await getLayoutSettings().catch(() => ({}));

    const siteName = layout.site_name || "StartupSaga.in";
    const socials = layout.socials || [];
    const sameAs = Array.isArray(socials) ? socials.map((s: any) => s.url).filter(Boolean) : [];

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteName,
        url: SITE_URL,
        logo: layout.site_logo || `${SITE_URL}/og-image.jpg`,
        sameAs: sameAs.length > 0 ? sameAs : [
            "https://twitter.com/startupsaga",
            "https://linkedin.com/company/startupsaga",
            "https://instagram.com/startupsaga"
        ],
        contactPoint: {
            "@type": "ContactPoint",
            email: "hello@startupsaga.in",
            contactType: "customer support"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: siteName,
        url: SITE_URL,
        description: "Discover inspiring Indian startup stories and founder journeys.",
        publisher: {
            "@id": `${SITE_URL}/#organization`
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/stories?search={search_term_string}`
            },
            "query-input": "required name=search_term_string",
        },
    };


    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`} suppressHydrationWarning>
                <JsonLd data={orgSchema} />
                <JsonLd data={websiteSchema} />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
