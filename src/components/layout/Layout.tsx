import { ReactNode, Suspense, cache } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { getNav, getLayoutSettings } from "@/lib/api";

import { FrontendBreadcrumbs } from "./FrontendBreadcrumbs";

// Deduplicate getLayoutSettings calls within the same request
// so Header and Footer share one fetch instead of making two.
const getCachedLayoutSettings = cache(() => getLayoutSettings().catch(() => ({})));
const getCachedNav = cache(() => getNav('header').catch(() => []));

interface LayoutProps {
  children: ReactNode;
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
 */
async function FooterServer() {
  const layout = await getCachedLayoutSettings();
  return <Footer siteSettings={layout} />;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Suspense fallback={<div className="h-20 bg-white border-b border-zinc-200 animate-pulse" />}>
        <HeaderServer />
      </Suspense>
      <main className="flex-1 bg-white">
        <FrontendBreadcrumbs />
        {children}
      </main>
      <Suspense fallback={<div className="h-[400px] bg-zinc-50 animate-pulse" />}>
        <FooterServer />
      </Suspense>
    </div>
  );
}
