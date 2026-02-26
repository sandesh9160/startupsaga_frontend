/**
 * @file types/index.ts
 * @description Centralized type definitions for the StartupSaga platform.
 */

export interface Story {
    id?: number;
    slug: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    category: string;
    categorySlug?: string;
    city: string;
    citySlug?: string;
    publishDate: string;
    author: string;
    author_name?: string;
    content: string;
    read_time?: number;
    isFeatured?: boolean;
    published_at?: string;
    publish_date?: string;
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
    category_name?: string;
    category_slug?: string;
    city_slug?: string;
    sections?: any[];
    related_startup?: {
        name: string;
        slug: string;
        logo: string;
        category?: string;
        category_name?: string;
        city?: string;
        citySlug?: string;
        founded_year?: number;
        team_size?: string;
        founders_data?: any[];
        website_url?: string;
        funding_stage?: string;
        stage?: string;
    };
}

export interface Startup {
    id?: number;
    slug: string;
    name: string;
    tagline: string;
    logo: string;
    category: string;
    categorySlug?: string;
    city: string;
    citySlug?: string;
    website?: string;
    website_url?: string;
    description: string;
    founded_year?: number;
    funding_stage?: string;
    business_model?: string;
    team_size?: string;
    industry_tags?: string[];
    founders_data?: Array<{ name: string; role?: string; linkedin?: string; image?: string }>;
    /** @deprecated use funding_stage */
    stage?: string;
    /** @deprecated use business_model */
    sector?: string;
    og_image?: string;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
}

export interface City {
    slug: string;
    name: string;
    image: string;
    startupCount: number;
    storyCount?: number;
    unicornCount?: number;
    description: string;
    tier?: string;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
}

export interface Category {
    slug: string;
    name: string;
    iconName?: string;
    startupCount: number;
    storyCount?: number;
    description: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
}

export interface PageSection {
    id: string;
    section_type: string;
    type?: string;
    title: string;
    name?: string;
    description?: string;
    content?: string;
    settings?: Record<string, any>;
    data?: any[];
    order?: number;
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
    settings?: Record<string, any>;
}

export interface SiteSettings {
    site_name?: string;
    site_logo?: string;
}
