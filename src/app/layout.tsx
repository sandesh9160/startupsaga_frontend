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

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "StartupSaga.in | Startup Stories of India",
    description: "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.",
    openGraph: {
        title: "StartupSaga.in | Startup Stories of India",
        description: "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.",
        url: SITE_URL,
        siteName: "StartupSaga.in",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "StartupSaga.in",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "StartupSaga.in | Startup Stories of India",
        description: "Discover inspiring Indian startup stories, founder journeys, and the companies reshaping the ecosystem.",
        images: ["/og-image.jpg"],
    },
    icons: {
        icon: "/favicon.png",
        shortcut: "/favicon.png",
        apple: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "StartupSaga.in",
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.jpg`,
        sameAs: [],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "StartupSaga.in",
        url: SITE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/stories?search={search_term_string}`,
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
