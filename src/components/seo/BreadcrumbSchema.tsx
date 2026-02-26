/**
 * @file BreadcrumbSchema.tsx
 * @description Generates BreadcrumbList JSON-LD schema.
 * Replaces the inline breadcrumb objects in each page file.
 *
 * Usage:
 *   <BreadcrumbSchema items={[
 *     { name: "Home", url: SITE_URL },
 *     { name: "Stories", url: `${SITE_URL}/stories` },
 *     { name: story.title, url: canonical },
 *   ]} />
 */

import { JsonLd } from "./JsonLd";

export interface BreadcrumbItem {
    name: string;
    /** Absolute URL for this breadcrumb step */
    url: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return <JsonLd data={schema} />;
}
