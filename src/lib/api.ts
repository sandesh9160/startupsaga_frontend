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
  Page,
  PaginatedResponse
} from "@/types";
import { cache } from "react";

export type {
  Story,
  Startup,
  City,
  Category,
  PageSection,
  Page
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
  const url = `${API_BASE_URL}${endpoint}`;

  // if (typeof window === "undefined" && url.includes("localhost")) {
  //   url = url.replace("localhost", "127.0.0.1");
  // }

  try {
    // Respect caller-supplied `next` config (e.g. revalidate: 3600 for
    // layout/SEO settings) instead of always overriding with 60s.
    const callerNext = (options as Record<string, unknown>)?.next as Record<string, unknown> | undefined;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
      },
      next: { revalidate: 60, ...callerNext },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      let message = `API Error: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.error) message = errorData.error;
      } catch {
        // Fallback to default message
      }
      throw new Error(message);
    }

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    const err = error as Error;
    // Silent fail for 404s
    if (err.message?.includes('404')) {
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
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return fetchList<Story>(`/stories/${query ? `?${query}` : ''}`);
  },

  /** Get single story by slug */
  getStory: (slug: string) => fetchAPI(`/stories/${slug}/`),

  /** Get trending/featured stories */
  getTrending: (): Promise<Story[]> => fetchList<Story>("/stories/trending/"),

  /** Get startups list */
  getStartups: (params?: Record<string, string | number | boolean | undefined>): Promise<Startup[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
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
  getLayout: () => fetchAPI("/layout-settings/", { next: { revalidate: 3600 } }),

  /** Get navigation menus */
  getNav: (pos: string = "header") => fetchAPI(`/navigation/?position=${pos}&hierarchical=true`, { next: { revalidate: 3600 } }).then(data => {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(Boolean);
    if (typeof data === 'object' && Array.isArray(data.results)) {
      return data.results.filter(Boolean);
    }
    return [];
  }),

  getTheme: (params: { pageKey?: string; pageSlug?: string }) => getThemeSettings(params),
  getSEO: () => fetchAPI("/seo-settings/", { next: { revalidate: 3600 } }),
  getPlatformStats: () => fetchAPI("/platform-stats/"),
};

// Simplified exports for existing code
export const getStories = cache(publicApi.getStories);
export const getStoryBySlug = cache(publicApi.getStory);
export const getTrendingStories = cache(publicApi.getTrending);
export const getStartups = cache(publicApi.getStartups);
export const getStartupBySlug = cache(publicApi.getStartup);
export const getCities = cache(publicApi.getHubs);
export const getCityBySlug = cache(publicApi.getHub);
export const getSections = cache(publicApi.getSections);
export const getNavigation = cache(publicApi.getNav);
export const getNav = cache(publicApi.getNav);
export const getLayoutSettings = cache(publicApi.getLayout);
export const getSEOSettings = cache(publicApi.getSEO);
export const getPlatformStats = cache(publicApi.getPlatformStats);
export const getPageBySlug = cache((slug: string): Promise<Page | null> => fetchAPI(`/pages/${slug}/`));
export const getCategories = cache(() => fetchList<Category>("/categories/"));
export const getCategoryBySlug = cache((slug: string) => fetchAPI(`/categories/${slug}/`));
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
export const submitStartup = async (data: Record<string, unknown>) => {
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

