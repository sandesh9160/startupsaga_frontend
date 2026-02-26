/**
 * @file OrganizationSchema.tsx
 * @description Generates Organization JSON-LD for CMS pages and other general pages.
 * For startup-specific Organization schema, use StartupSchema.tsx.
 */

import { JsonLd } from "./JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logoUrl?: string;
    description?: string;
    sameAs?: string[];
    /** Optional contact email */
    email?: string;
    /** Optional contact phone */
    phone?: string;
    /** Optional founding year e.g. 2021 */
    foundingYear?: number | string;
}

export function OrganizationSchema({
    name = "StartupSaga.in",
    url = SITE_URL,
    logoUrl = `${SITE_URL}/og-image.jpg`,
    description = "India's premier platform for startup stories, founder journeys, and ecosystem news.",
    sameAs = [],
    email,
    phone,
    foundingYear,
}: OrganizationSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name,
        url,
        logo: {
            "@type": "ImageObject",
            url: logoUrl,
            width: 1200,
            height: 630,
        },
        description,
        areaServed: {
            "@type": "Country",
            name: "India",
        },
        ...(email ? { email } : {}),
        ...(phone ? { telephone: phone } : {}),
        ...(foundingYear ? { foundingDate: String(foundingYear) } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
    };

    return <JsonLd data={schema} />;
}
