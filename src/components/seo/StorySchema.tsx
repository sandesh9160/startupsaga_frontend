/**
 * @file StorySchema.tsx
 * @description Self-contained schema component for story detail pages.
 *
 * Combines:
 *  - Article (or NewsArticle) JSON-LD
 *  - BreadcrumbList JSON-LD
 *
 * Usage in stories/[slug]/page.tsx:
 *   import { StorySchema } from "@/components/seo/StorySchema";
 *
 *   <StorySchema story={story} canonical={canonical} />
 *
 * No need to import ArticleSchema or BreadcrumbSchema separately.
 */

import { ArticleSchema } from "./ArticleSchema";
import { BreadcrumbSchema } from "./BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function resolveImageUrl(url: string | null | undefined): string {
    if (!url) return `${SITE_URL}/og-image.jpg`;
    if (url.startsWith("http")) return url;
    const base = API_BASE.replace("/api", "");
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
}

interface StorySchemaProps {
    story: {
        title: string;
        slug: string;
        content?: string;
        excerpt?: string;
        meta_description?: string;
        meta_keywords?: string;
        og_image?: string;
        thumbnail?: string;
        author?: string;
        author_name?: string;
        published_at?: string;
        updated_at?: string;
        category?: string | { name?: string };
        category_name?: string;
        canonical_override?: string;
    };
    /** Pre-computed canonical URL (respects canonical_override) */
    canonical: string;
    /** Override schema type — default: "Article" */
    articleType?: "Article" | "NewsArticle" | "BlogPosting";
}

export function StorySchema({
    story,
    canonical,
    articleType = "Article",
}: StorySchemaProps) {
    const cleanContent = story.content?.replace(/<[^>]*>?/gm, "") || "";
    const description =
        story.meta_description ||
        story.excerpt ||
        cleanContent.slice(0, 160) ||
        "Startup story on StartupSaga.in";

    const imageUrl = resolveImageUrl(story.og_image || story.thumbnail);
    const authorName = story.author_name || story.author || "Editorial Team";

    const sectionName =
        story.category_name ||
        (typeof story.category === "object" ? story.category?.name : undefined) ||
        undefined;

    return (
        <>
            <ArticleSchema
                url={canonical}
                title={story.title}
                description={description}
                imageUrl={imageUrl}
                datePublished={story.published_at}
                dateModified={story.updated_at}
                authorName={authorName}
                articleSection={sectionName}
                keywords={story.meta_keywords}
                articleType={articleType}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Stories", url: `${SITE_URL}/stories` },
                    { name: story.title, url: canonical },
                ]}
            />
        </>
    );
}
