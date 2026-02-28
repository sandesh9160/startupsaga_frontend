import type { MetadataRoute } from "next";

/**
 * Base Site URL
 * Falls back to localhost if environment variable is not set
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Backend API Base URL
 * Used to fetch dynamic content (stories, startups, etc.)
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/**
 * Generic JSON fetch helper
 * - Replaces localhost with 127.0.0.1 (to avoid IPv6 issues)
 * - Uses ISR revalidation (1 hour)
 * - Throws error if request fails
 */
async function fetchJson<T>(url: string): Promise<T> {
  const urlToUse = url.includes("localhost")
    ? url.replace("localhost", "127.0.0.1")
    : url;

  const res = await fetch(urlToUse, {
    next: { revalidate: 3600 }, // Revalidate every 1 hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Utility to normalize API responses
 * Handles paginated DRF responses (`results`)
 */
function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  return data?.results || [];
}

/**
 * Dynamic Sitemap Generator
 * This runs on the server and generates:
 * - Static routes
 * - Dynamic story pages
 * - Startup pages
 * - Categories
 * - Cities
 * - Custom CMS pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Initialize empty collections
  let stories: any[] = [];
  let startups: any[] = [];
  let categories: any[] = [];
  let cities: any[] = [];
  let pages: any[] = [];

  try {
    /**
     * Fetch all required resources in parallel
     * Improves performance vs sequential fetching
     */
    const [
      storiesRes,
      startupsRes,
      categoriesRes,
      citiesRes,
      pagesRes,
    ] = await Promise.all([
      fetchJson<any>(`${API_BASE_URL}/stories/`),
      fetchJson<any>(`${API_BASE_URL}/startups/`),
      fetchJson<any[]>(`${API_BASE_URL}/categories/`),
      fetchJson<any[]>(`${API_BASE_URL}/cities/`),
      fetchJson<any[]>(`${API_BASE_URL}/pages/`),
    ]);

    // Normalize API responses
    stories = toArray(storiesRes);
    startups = toArray(startupsRes);
    categories = Array.isArray(categoriesRes) ? categoriesRes : [];
    cities = Array.isArray(citiesRes) ? citiesRes : [];
    pages = Array.isArray(pagesRes) ? pagesRes : [];
  } catch (e) {
    /**
     * Prevent sitemap crash if API fails
     * Logs error but still returns static pages
     */
    console.error("Sitemap fetch error:", e);
  }

  /**
   * Static Core Pages
   * These always exist regardless of API state
   */
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/stories`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/startups`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  /**
   * Dynamic Story Pages
   */
  const storyPages = stories.map((s: any) => ({
    url: `${SITE_URL}/stories/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    images: s.thumbnail ? [s.thumbnail] : [],
  }));

  /**
   * Dynamic Startup Pages
   */
  const startupPages = startups.map((s: any) => ({
    url: `${SITE_URL}/startups/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: s.logo ? [s.logo] : [],
  }));

  /**
   * Category Listing Pages
   */
  const categoryPages = categories.map((c: any) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  /**
   * City Listing Pages
   */
  const cityPages = cities.map((c: any) => ({
    url: `${SITE_URL}/cities/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  /**
   * CMS / Custom Static Pages
   */
  const pagePages = pages.map((p: any) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  /**
   * Final Combined Sitemap
   */
  return [
    ...staticPages,
    ...storyPages,
    ...startupPages,
    ...categoryPages,
    ...cityPages,
    ...pagePages,
  ];
}