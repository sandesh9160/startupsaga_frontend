/**
 * @file CategoryPageSchema.tsx
 * @description Self-contained schema component for category detail pages.
 *
 * Renders:
 *  - BreadcrumbList JSON-LD
 *
 * Usage in categories/[slug]/page.tsx:
 *   import { CategoryPageSchema } from "@/components/seo/CategoryPageSchema";
 *
 *   <CategoryPageSchema name={category.name} slug={slug} />
 */

import { BreadcrumbSchema } from "./BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

interface CategoryPageSchemaProps {
    /** Category display name */
    name: string;
    /** Category slug */
    slug: string;
}

export function CategoryPageSchema({ name, slug }: CategoryPageSchemaProps) {
    const canonical = `${SITE_URL}/categories/${slug}`;

    return (
        <BreadcrumbSchema
            items={[
                { name: "Home", url: SITE_URL },
                { name: "Categories", url: `${SITE_URL}/categories` },
                { name, url: canonical },
            ]}
        />
    );
}
