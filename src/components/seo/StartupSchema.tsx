/**
 * @file StartupSchema.tsx
 * @description Organization schema specifically for startup detail pages.
 *
 * Fixes from SEO Audit:
 * - FIX: `url` correctly points to startup's own website (not the StartupSaga page).
 *   The StartupSaga page URL is now added to `sameAs` instead.
 * - FIX: `logo` is now a proper `ImageObject` instead of a raw URL string.
 * - FIX: `foundingDate` is cast to string (schema.org expects string, not integer).
 * - Adds `address` with `addressCountry: "IN"`.
 * - Adds optional `numberOfEmployees` from team_size.
 */

import { JsonLd } from "./JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

export interface FounderData {
    name: string;
    role?: string;
    linkedin?: string;
}

interface StartupSchemaProps {
    /** The startup's canonical page on StartupSaga */
    startupsagaUrl: string;
    name: string;
    description: string;
    /** Absolute URL of the startup's own website */
    websiteUrl?: string;
    /** Absolute URL to logo image */
    logoUrl?: string;
    foundingYear?: number | string | null;
    cityName?: string;
    founders?: FounderData[];
    /** e.g. "1-10", "100-500", "1000+" */
    teamSize?: string;
    /** LinkedIn, Twitter, Crunchbase URLs */
    additionalSameAs?: string[];
}

export function StartupSchema({
    startupsagaUrl,
    name,
    description,
    websiteUrl,
    logoUrl,
    foundingYear,
    cityName,
    founders = [],
    teamSize,
    additionalSameAs = [],
}: StartupSchemaProps) {
    // sameAs includes startup's own website + extra social profiles + StarupSaga profile
    const sameAsUrls = [
        ...(websiteUrl ? [websiteUrl] : []),
        ...additionalSameAs,
        startupsagaUrl,
    ].filter(Boolean);

    const schema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${startupsagaUrl}/#organization`,
        name,
        // url should be the org's own domain, not the StartupSaga profile page
        url: websiteUrl || startupsagaUrl,
        description,
        ...(logoUrl
            ? {
                logo: {
                    "@type": "ImageObject",
                    url: logoUrl,
                    width: 200,
                    height: 200,
                },
            }
            : {}),
        ...(foundingYear ? { foundingDate: String(foundingYear) } : {}),
        ...(cityName
            ? {
                address: {
                    "@type": "PostalAddress",
                    addressLocality: cityName,
                    addressCountry: "IN",
                },
                location: {
                    "@type": "Place",
                    name: cityName,
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: cityName,
                        addressCountry: "IN",
                    },
                },
            }
            : {
                address: {
                    "@type": "PostalAddress",
                    addressCountry: "IN",
                },
            }),
        areaServed: {
            "@type": "Country",
            name: "India",
        },
        ...(founders.length > 0
            ? {
                founders: founders.map((f) => ({
                    "@type": "Person",
                    name: f.name,
                    ...(f.role ? { jobTitle: f.role } : {}),
                    ...(f.linkedin ? { sameAs: f.linkedin } : {}),
                })),
            }
            : {}),
        ...(teamSize
            ? {
                numberOfEmployees: {
                    "@type": "QuantitativeValue",
                    description: teamSize,
                },
            }
            : {}),
        ...(sameAsUrls.length > 0 ? { sameAs: sameAsUrls } : {}),
    };

    return <JsonLd data={schema} />;
}
