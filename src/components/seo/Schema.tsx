/**
 * @file Schema.tsx
 * @description Central barrel export for all StartupSaga JSON-LD schema components.
 *
 * ─── Available Schemas ────────────────────────────────────────────────────
 *
 *  WebSiteSchema       → Root layout (once, site-wide)
 *                        Generates WebSite + Organization @graph
 *
 *  OrganizationSchema  → General pages needing org info
 *                        Use WebSiteSchema on homepage instead
 *
 *  ArticleSchema       → /stories/[slug]
 *                        Article / NewsArticle / BlogPosting
 *
 *  StartupSchema       → /startups/[slug]
 *                        Organization with founders, address, teamSize
 *
 *  BreadcrumbSchema    → All detail pages (stories, startups, cities, categories, CMS)
 *                        BreadcrumbList
 *
 *  ItemListSchema      → /stories, /startups, /categories, /cities
 *                        ItemList / CollectionPage
 *
 *  FAQSchema           → CMS pages with FAQ sections
 *                        FAQPage
 *
 * ─── Quick Usage ──────────────────────────────────────────────────────────
 *
 *  import {
 *    WebSiteSchema,
 *    ArticleSchema,
 *    BreadcrumbSchema,
 *    ItemListSchema,
 *    FAQSchema,
 *    StartupSchema,
 *  } from "@/components/seo/Schema";
 *
 * ─── Pages → Schema Mapping ───────────────────────────────────────────────
 *
 *  app/layout.tsx             → <WebSiteSchema />
 *  app/stories/[slug]         → <ArticleSchema /> + <BreadcrumbSchema />
 *  app/startups/[slug]        → <StartupSchema /> + <BreadcrumbSchema />
 *  app/categories/[slug]      → <BreadcrumbSchema />
 *  app/cities/[slug]          → <BreadcrumbSchema />
 *  app/[pageSlug]             → <BreadcrumbSchema /> + conditionally <FAQSchema />
 *  app/stories                → <ItemListSchema />
 *  app/startups               → <ItemListSchema />
 *
 */

export { WebSiteSchema } from "./WebSiteSchema";
export { OrganizationSchema } from "./OrganizationSchema";
export { ArticleSchema } from "./ArticleSchema";
export { StartupSchema } from "./StartupSchema";
export type { FounderData } from "./StartupSchema";
export { BreadcrumbSchema } from "./BreadcrumbSchema";
export type { BreadcrumbItem } from "./BreadcrumbSchema";
export { ItemListSchema } from "./ItemListSchema";
export type { ItemListEntry } from "./ItemListSchema";
export { FAQSchema } from "./FAQSchema";
export type { FAQItem } from "./FAQSchema";

// ─── Page-level composite schema components ───────────────────────────────
// Drop-in, single-import schema for each page type.
// Pass the full data object — schema logic stays inside the seo/ folder.

export { StorySchema } from "./StorySchema";
export { StartupPageSchema } from "./StartupPageSchema";
export { CategoryPageSchema } from "./CategoryPageSchema";
export { CityPageSchema } from "./CityPageSchema";

// Re-export the base JsonLd primitive for custom schemas
export { JsonLd } from "./JsonLd";
