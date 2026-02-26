/**
 * @file ItemListSchema.tsx
 * @description Generates ItemList JSON-LD schema for listing pages
 * (stories, startups, categories, cities).
 *
 * Resolves FIX-010 from SEO Audit:
 * Adding ItemList structured data to listing pages enables Google to
 * show rich carousel results in search.
 *
 * Usage (Stories page):
 *   <ItemListSchema
 *     name="Startup Stories in India"
 *     description="Explore the latest Indian startup stories..."
 *     url={`${SITE_URL}/stories`}
 *     items={stories.map(s => ({
 *       name: s.title,
 *       url: `${SITE_URL}/stories/${s.slug}`,
 *       imageUrl: s.thumbnail,
 *       description: s.excerpt,
 *     }))}
 *   />
 */

import { JsonLd } from "./JsonLd";

export interface ItemListEntry {
    name: string;
    /** Absolute URL to the item's detail page */
    url: string;
    /** Optional absolute URL to the item's thumbnail/image */
    imageUrl?: string;
    description?: string;
}

interface ItemListSchemaProps {
    /** Human-readable name for this list e.g. "Startup Stories in India" */
    name: string;
    description?: string;
    /** Canonical URL of the listing page itself */
    url: string;
    items: ItemListEntry[];
    /** Defaults to "ItemList" — override to "CollectionPage" if appropriate */
    listType?: "ItemList" | "CollectionPage";
}

export function ItemListSchema({
    name,
    description,
    url,
    items,
    listType = "ItemList",
}: ItemListSchemaProps) {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": listType,
        "@id": `${url}/#itemlist`,
        name,
        url,
        ...(description ? { description } : {}),
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: item.url,
            name: item.name,
            ...(item.imageUrl || item.description
                ? {
                    item: {
                        "@type": "Article",
                        name: item.name,
                        url: item.url,
                        ...(item.imageUrl
                            ? { image: { "@type": "ImageObject", url: item.imageUrl } }
                            : {}),
                        ...(item.description ? { description: item.description } : {}),
                    },
                }
                : {}),
        })),
    };

    return <JsonLd data={schema} />;
}
