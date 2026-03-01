/**
 * @file lib/api.ts
 * @description Professional Public API Client for StartupSaga Website.
 * Optimized for performance and SEO-readiness.
 */

import {
  Story,
  Startup,
  City,
  Category,
  PageSection,
  PaginatedResponse
} from "@/types";

export type {
  Story,
  Startup,
  City,
  Category,
  PageSection
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/**
 * Resolve redirect for a path (slug changes → 301). Call before showing 404.
 * @returns redirect path (e.g. "/stories/new-slug/") or null
 */
export async function resolveRedirect(pathname: string): Promise<string | null> {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const base = API_BASE_URL.replace(/\/api\/?$/, "");
  const url = `${base}/api/redirect-resolve/?path=${encodeURIComponent(path)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.redirect_to ?? null;
  } catch {
    return null;
  }
}
/**
 * Shared fetch wrapper with enhanced error handling
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  let url = `${API_BASE_URL}${endpoint}`;

  if (typeof window === "undefined" && url.includes("localhost")) {
    url = url.replace("localhost", "127.0.0.1");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
      },
      // Use ISR (60s) to allow static generation while keeping content fresh.
      // Avoids "Dynamic server usage" errors during build.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      let message = `API Error: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.error) message = errorData.error;
      } catch (e) {
        // Fallback to default message
      }
      throw new Error(message);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    if (!error.message?.includes('404')) {
      console.error(`Fetch error [${url}]:`, error);
    }
    throw error;
  }
}

/**
 * Helper to ensure we get an array from endpoints that might be paginated
 */
export async function fetchList<T>(endpoint: string, options: RequestInit = {}): Promise<T[]> {
  const data = await fetchAPI(endpoint, options);
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  if (typeof data === 'object' && Array.isArray(data.results)) {
    return data.results.filter(Boolean);
  }
  return [];
}

/** Get merged theme settings (global + page overrides) */
export async function getThemeSettings(params: { pageKey?: string; pageSlug?: string }) {
  const clean: Record<string, string> = {};
  if (params.pageKey) clean.pageKey = params.pageKey;
  if (params.pageSlug) clean.pageSlug = params.pageSlug;
  const query = new URLSearchParams(clean).toString();
  return fetchAPI(`/theme/${query ? `?${query}` : ""}`);
}

/**
 * Public Data Services
 */
export const publicApi = {
  /** Get stories with filters */
  getStories: (params?: Record<string, string | number | boolean | undefined>): Promise<Story[]> => {
    const query = new URLSearchParams(params as any).toString();
    return fetchList<Story>(`/stories/${query ? `?${query}` : ''}`);
  },

  /** Get single story by slug */
  getStory: (slug: string) => fetchAPI(`/stories/${slug}/`),

  /** Get trending/featured stories */
  getTrending: (): Promise<Story[]> => fetchList<Story>("/stories/trending/"),

  /** Get startups list */
  getStartups: (params?: Record<string, string | number | boolean | undefined>): Promise<Startup[]> => {
    const query = new URLSearchParams(params as any).toString();
    return fetchList<Startup>(`/startups/${query ? `?${query}` : ''}`);
  },

  /** Get startup detail */
  getStartup: (slug: string) => fetchAPI(`/startups/${slug}/`),

  /** Get hubs (cities) */
  getHubs: (): Promise<City[]> => fetchList<City>("/cities/"),

  /** Get single hub (city) by slug */
  getHub: (slug: string) => fetchAPI(`/cities/${slug}/`),

  /** Get page content/sections */
  getSections: (page: string = "homepage", pageSlug?: string): Promise<PageSection[]> => {
    let url = `/sections/?page=${page}`;
    if (pageSlug) url = `/sections/?page_slug=${pageSlug}`;
    return fetchList<PageSection>(url);
  },

  /** Get theme/layout settings */
  getLayout: () => fetchAPI("/layout-settings/"),

  /** Get navigation menus */
  getNav: (pos: string = "header") => fetchList<any>(`/navigation/?position=${pos}&hierarchical=true`),

  getTheme: (params: { pageKey?: string; pageSlug?: string }) => getThemeSettings(params),
  getSEO: () => fetchAPI("/seo-settings/"),
  getPlatformStats: () => fetchAPI("/platform-stats/"),
};

// Simplified exports for existing code
export const getStories = publicApi.getStories;
export const getStoryBySlug = publicApi.getStory;
export const getTrendingStories = publicApi.getTrending;
export const getStartups = publicApi.getStartups;
export const getStartupBySlug = publicApi.getStartup;
export const getCities = publicApi.getHubs;
export const getCityBySlug = publicApi.getHub;
export const getSections = publicApi.getSections;
export const getNavigation = publicApi.getNav;
export const getNav = publicApi.getNav;
export const getLayoutSettings = publicApi.getLayout;
export const getSEOSettings = publicApi.getSEO;
export const getPlatformStats = publicApi.getPlatformStats;
export const getPageBySlug = (slug: string) => fetchAPI(`/pages/${slug}/`);
export const getCategories = () => fetchList<Category>("/categories/");
export const getCategoryBySlug = (slug: string) => fetchAPI(`/categories/${slug}/`);
export const getStoriesPage = async (params?: Record<string, string | number | boolean | undefined>): Promise<PaginatedResponse<Story>> => {

  // Filter out undefined/null values to avoid sending "undefined" as string
  const cleanParams: Record<string, string> = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== undefined) {
        cleanParams[key] = String(value);
      }
    });
  }
  const query = new URLSearchParams(cleanParams).toString();
  const data = await fetchAPI(`/stories/${query ? `?${query}` : ''}`);
  if (data && Array.isArray(data.results)) {
    data.results = data.results.filter(Boolean);
  }
  return data;
};

/** Paginated startups with filters */
export const getStartupsPage = async (params?: Record<string, string | number | boolean | undefined>): Promise<PaginatedResponse<Startup>> => {
  const cleanParams: Record<string, string> = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== undefined) {
        cleanParams[key] = String(value);
      }
    });
  }
  const query = new URLSearchParams(cleanParams).toString();
  const data = await fetchAPI(`/startups/${query ? `?${query}` : ''}`);
  if (data && Array.isArray(data.results)) {
    data.results = data.results.filter(Boolean);
  }
  return data;
};

/**
 * Submit a new startup/story for review
 */
export const submitStartup = async (data: any) => {
  return fetchAPI('/submissions/create/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const subscribeNewsletter = async (email: string) => {
  return fetchAPI('/newsletter/subscribe/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const unsubscribeNewsletter = async (email: string, token: string) => {
  return fetchAPI('/newsletter/unsubscribe/', {
    method: 'POST',
    body: JSON.stringify({ email, token }),
  });
};

