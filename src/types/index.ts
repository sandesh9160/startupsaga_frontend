/**
 * @file types/index.ts
 * @description Centralized type definitions for the StartupSaga platform.
 */

export interface Category {
    slug: string;
    name: string;
    icon?: string;
    iconName?: string;
    storyCount?: number;
    story_count?: number;
    startupCount: number;
    /** @alias startupCount */
    startup_count?: number;
    description: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
    /** @alias name (some API responses use title) */
    title?: string;
    /** legacy id field */
    id?: number | string;
    canonical_override?: string;
    noindex?: boolean;
}

export interface City {
    slug: string;
    name: string;
    image: string;
    startupCount: number;
    startup_count?: number;
    storyCount?: number;
    /** @alias storyCount */
    story_count?: number;
    unicornCount?: number;
    fundingAmount?: string;
    investorCount?: number;
    description: string;
    tier?: string;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
    /** @alias name (some API responses use title) */
    title?: string;
    /** legacy id field */
    id?: number | string;
    /** @alias image */
    imageUrl?: string;
    /** @alias image */
    thumbnail?: string;
    canonical_override?: string;
    noindex?: boolean;
}

export interface Story {
    id?: number;
    slug: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    category: string | Category;
    category_name?: string;
    categorySlug?: string;
    category_slug?: string;
    city: string | City;
    city_name?: string;
    citySlug?: string;
    city_slug?: string;
    publishDate: string;
    publish_date?: string;
    author: string;
    author_name?: string;
    content: string;
    read_time?: number;
    isFeatured?: boolean;
    published_at?: string;
    updated_at?: string;
    stage?: string;
    views?: number;
    trendingScore?: number;
    status?: "draft" | "pending" | "published" | "archived";
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
    image_alt?: string;
    show_table_of_contents?: boolean;
    canonical_override?: string;
    noindex?: boolean;
    sections?: PageSection[];
    related_startup?: Partial<Startup>;
}

export interface Startup {
    id?: number;
    slug: string;
    name: string;
    tagline: string;
    logo: string;
    category: string | Category;
    categorySlug?: string;
    city: string | City;
    citySlug?: string;
    website?: string;
    website_url?: string;
    description: string;
    founded_year?: number;
    funding_stage?: string;
    business_model?: string;
    team_size?: string;
    industry_tags?: string[];
    founders?: string;
    founder_name?: string;
    founders_data?: Array<{ name: string; role?: string; linkedin?: string; image?: string }>;
    /** @deprecated use funding_stage */
    stage?: string;
    /** @deprecated use business_model */
    sector?: string;
    og_image?: string;
    is_featured?: boolean;
    title?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    is_active?: boolean | number;
    updated_at?: string;
    valuation?: string | number;
    category_name?: string;
    city_name?: string;
    canonical_override?: string;
    noindex?: boolean;
}

export interface PageSection {
    id: string;
    section_type: string;
    type?: string;
    title?: string;
    name?: string;
    description?: string;
    subtitle?: string;
    content?: string;
    settings?: Record<string, unknown>;
    data?: unknown[];
    order?: number;
    is_active?: boolean | number | string;
    /** CMS-provided CTA link URL */
    link_url?: string;
    /** CMS-provided CTA link text */
    link_text?: string;
    /** CMS-provided image URL */
    image?: string;
}

export interface Page {
    id?: number;
    slug: string;
    title: string;
    content?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_override?: string;
    noindex?: boolean;
    sections?: PageSection[];
    is_active?: boolean | number;
    updated_at?: string;
    og_image?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    total_pages?: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface NavItem {
    id: string;
    label: string;
    url: string;
    children?: NavItem[];
    settings?: Record<string, unknown>;
}

export interface SiteSettings {
    site_name?: string;
    site_logo?: string;
}
