/**
 * @file WebSiteSchema.tsx
 * @description Generates WebSite + SearchAction JSON-LD structured data.
 * Should be rendered ONCE in the root layout (server component).
 * Resolves FIX-001: replaces the broken empty <JsonLd data={{}} /> in layout.tsx
 */

import { JsonLd } from "./JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

interface WebSiteSchemaProps {
    name?: string;
    description?: string;
    url?: string;
    /** Absolute URL to the OG/logo image */
    logoUrl?: string;
    /** Social profile URLs for sameAs */
    sameAs?: string[];
}

export function WebSiteSchema({
    name = "StartupSaga.in",
    description = "Startup Stories of India — Discover inspiring founder journeys, funding rounds, and the companies reshaping the Indian startup ecosystem.",
    url = SITE_URL,
    logoUrl = `${SITE_URL}/og-image.jpg`,
    sameAs = [],
}: WebSiteSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${url}/#website`,
                url,
                name,
                description,
                inLanguage: "en-IN",
                potentialAction: {
                    "@type": "SearchAction",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${url}/stories?search={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                },
                publisher: {
                    "@id": `${url}/#organization`,
                },
            },
            {
                "@type": "Organization",
                "@id": `${url}/#organization`,
                name,
                url,
                logo: {
                    "@type": "ImageObject",
                    "@id": `${url}/#logo`,
                    url: logoUrl,
                    width: 1200,
                    height: 630,
                    caption: name,
                },
                image: { "@id": `${url}/#logo` },
                description,
                ...(sameAs.length > 0 ? { sameAs } : {}),
            },
        ],
    };

    return <JsonLd data={schema} />;
}
