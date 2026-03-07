import { ReactNode, Suspense, cache } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { getNav, getLayoutSettings } from "@/lib/api";

import { FrontendBreadcrumbs } from "./FrontendBreadcrumbs";

// Deduplicate getLayoutSettings calls within the same request
// so Header and Footer share one fetch instead of making two.
// This also piggybacks on the root layout's cache when possible.
const getCachedLayoutSettings = cache(() => getLayoutSettings().catch(() => ({})));
const getCachedNav = cache(() => getNav('header').catch(() => []));
const getCachedFooterNav = cache(() => getNav('footer,footer_company,footer_links').catch(() => []));

import { ThemeProvider, type ThemeSettings } from "../theme/ThemeProvider";
import { getThemeSettings } from "@/lib/api";

const getCachedTheme = cache((params: { pageKey?: string; pageSlug?: string }) => getThemeSettings(params).catch(() => ({})));

interface LayoutProps {
  children: ReactNode;
  pageKey?: string;
  pageSlug?: string;
  initialTheme?: ThemeSettings;
}

/**
 * Server component wrapper for ThemeProvider to fetch theme data without blocking the layout shell.
 */
async function ThemeServer({ children, pageKey, pageSlug, initialTheme }: LayoutProps) {
  const theme = initialTheme || await getCachedTheme({ pageKey, pageSlug });
  return (
    <ThemeProvider initialTheme={theme}>
      {children}
    </ThemeProvider>
  );
}

/**
 * Server component wrapper for Header to allow async data fetching without blocking the layout.
 */
async function HeaderServer() {
  const [nav, layout] = await Promise.all([
    getCachedNav(),
    getCachedLayoutSettings(),
  ]);
  return <Header initialNav={nav} siteSettings={layout} />;
}

/**
 * Server component wrapper for Footer to allow async data fetching without blocking the layout.
 * Fetches footer nav data on the server so the client Footer doesn't need to make API calls.
 */
async function FooterServer() {
  const [layout, footerNav] = await Promise.all([
    getCachedLayoutSettings(),
    getCachedFooterNav(),
  ]);
  // Process nav into the column structure Footer expects
  const columns = (Array.isArray(footerNav) ? footerNav : [])
    .filter(Boolean)
    .filter((i: { parent?: unknown }) => !i.parent)
    .sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0))
    .map((col: { label?: string; url?: string | null; children?: Array<{ order?: number }> }) => ({
      label: col.label,
      url: col.url || null,
      children: (col.children || []).sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0)),
    }));
  return <Footer siteSettings={layout} initialNav={columns} />;
}

export function Layout({ children, pageKey, pageSlug, initialTheme }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Suspense fallback={<div className="h-[72px] bg-white border-b border-zinc-200" />}>
        <HeaderServer />
      </Suspense>

      <main className="flex-1 bg-white">
        <FrontendBreadcrumbs />
        {/* Only wrap the content in ThemeServer if you need dynamic per-page overrides.
            Otherwise, move it higher but ensures it doesn't block initial shell bytes. */}
        <Suspense fallback={children}>
          <ThemeServer pageKey={pageKey} pageSlug={pageSlug} initialTheme={initialTheme}>
            {children}
          </ThemeServer>
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-[400px] bg-zinc-50" />}>
        <FooterServer />
      </Suspense>
    </div>
  );
}
