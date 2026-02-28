/**
 * @file StartupPageSchema.tsx
 * @description Self-contained schema component for startup detail pages.
 *
 * Combines:
 *  - Organization JSON-LD (with founders, address, teamSize)
 *  - BreadcrumbList JSON-LD
 *
 * Usage in startups/[slug]/page.tsx:
 *   import { StartupPageSchema } from "@/components/seo/StartupPageSchema";
 *
 *   <StartupPageSchema startup={startup} canonical={canonical} />
 *
 * No need to import StartupSchema or BreadcrumbSchema separately.
 */

import { StartupSchema } from "./StartupSchema";
import { BreadcrumbSchema } from "./BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";
const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://127.0.0.1:8000";

function resolveImageUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface StartupPageSchemaProps {
    startup: {
        name: string;
        slug: string;
        description?: string;
        tagline?: string;
        logo?: string;
        og_image?: string;
        website_url?: string;
        founded_year?: number | string | null;
        city?: string | { name?: string };
        team_size?: string;
        founders_data?: Array<{ name: string; role?: string; linkedin?: string }>;
        founder_name?: string;
        /** Optional — pulled from API if available */
        linkedin_url?: string;
    };
    /** Pre-computed canonical URL (respects canonical_override) */
    canonical: string;
}

export function StartupPageSchema({ startup, canonical }: StartupPageSchemaProps) {
    const cityName =
        typeof startup.city === "object"
            ? startup.city?.name
            : startup.city || undefined;

    const founders: Array<{ name: string; role?: string; linkedin?: string }> =
        startup.founders_data && Array.isArray(startup.founders_data)
            ? startup.founders_data.map((f) => ({
                name: f.name,
                role: f.role,
                linkedin: f.linkedin,
            }))
            : startup.founder_name
                ? [{ name: startup.founder_name, role: "Founder" }]
                : [];

    return (
        <>
            <StartupSchema
                startupsagaUrl={canonical}
                name={startup.name}
                description={startup.tagline || startup.description || ""}
                websiteUrl={startup.website_url}
                logoUrl={resolveImageUrl(startup.logo) || undefined}
                foundingYear={startup.founded_year ?? undefined}
                cityName={cityName}
                founders={founders}
                teamSize={startup.team_size}
                additionalSameAs={startup.linkedin_url ? [startup.linkedin_url] : []}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Startups", url: `${SITE_URL}/startups` },
                    { name: startup.name, url: canonical },
                ]}
            />
        </>
    );
}
