/**
 * @file ArticleSchema.tsx
 * @description Full Article / NewsArticle JSON-LD schema for story detail pages.
 *
 * Fixes from SEO Audit:
 * - FIX-014: Resolves dangling `publisher` @id by referencing the root Organization
 * - Adds missing `wordCount`, `inLanguage`, `keywords`, `url`, `image` as ImageObject
 * - Supports `NewsArticle` type for news-style stories
 */

import { JsonLd } from "./JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

interface ArticleSchemaProps {
    /** Canonical URL of the article page */
    url: string;
    title: string;
    description: string;
    /** Absolute URL to the featured image */
    imageUrl: string;
    /** ISO 8601 datetime string */
    datePublished?: string;
    /** ISO 8601 datetime string */
    dateModified?: string;
    authorName?: string;
    /** Author profile URL */
    authorUrl?: string;
    /** Story category / section */
    articleSection?: string;
    /** Comma-separated keyword string from CMS meta_keywords */
    keywords?: string;
    /** Approximate word count of the article */
    wordCount?: number;
    /** Use "NewsArticle" for news-style pieces, "Article" for features/case studies */
    articleType?: "Article" | "NewsArticle" | "BlogPosting";
}

export function ArticleSchema({
    url,
    title,
    description,
    imageUrl,
    datePublished,
    dateModified,
    authorName = "Editorial Team",
    authorUrl = `${SITE_URL}/about`,
    articleSection,
    keywords,
    wordCount,
    articleType = "Article",
}: ArticleSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": articleType,
        "@id": `${url}/#article`,
        url,
        headline: title,
        description,
        inLanguage: "en-IN",
        image: {
            "@type": "ImageObject",
            url: imageUrl,
            width: 1200,
            height: 630,
        },
        author: {
            "@type": "Person",
            name: authorName,
            url: authorUrl,
        },
        publisher: {
            // References the root Organization defined in WebSiteSchema
            "@id": `${SITE_URL}/#organization`,
        },
        isPartOf: {
            "@id": `${SITE_URL}/#website`,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        ...(articleSection ? { articleSection } : {}),
        ...(keywords ? { keywords } : {}),
        ...(wordCount ? { wordCount } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
    };

    return <JsonLd data={schema} />;
}
