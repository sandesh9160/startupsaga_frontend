/**
 * @file CityPageSchema.tsx
 * @description Self-contained schema component for city/hub detail pages.
 *
 * Renders:
 *  - BreadcrumbList JSON-LD
 *
 * Usage in cities/[slug]/page.tsx:
 *   import { CityPageSchema } from "@/components/seo/CityPageSchema";
 *
 *   <CityPageSchema name={city.name} slug={slug} />
 */

import { BreadcrumbSchema } from "./BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

interface CityPageSchemaProps {
    /** City display name */
    name: string;
    /** City slug */
    slug: string;
}

export function CityPageSchema({ name, slug }: CityPageSchemaProps) {
    const canonical = `${SITE_URL}/cities/${slug}`;

    return (
        <BreadcrumbSchema
            items={[
                { name: "Home", url: SITE_URL },
                { name: "Cities", url: `${SITE_URL}/cities` },
                { name, url: canonical },
            ]}
        />
    );
}
