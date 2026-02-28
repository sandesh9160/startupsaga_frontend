import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { getNav, getLayoutSettings } from "@/lib/api";

import { FrontendBreadcrumbs } from "./FrontendBreadcrumbs";

interface LayoutProps {
  children: ReactNode;
}

export async function Layout({ children }: LayoutProps) {
  let navItems: any[] = [];
  let layoutSettings: any = {};

  try {
    const [nav, layout] = await Promise.all([
      getNav('header'),
      getLayoutSettings()
    ]);
    navItems = nav;
    layoutSettings = layout;
  } catch (error) {
    console.error("Layout: Failed to fetch combined data", error);
  }

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Header initialNav={navItems} siteSettings={layoutSettings} />
      <main className="flex-1 bg-white">
        <FrontendBreadcrumbs />
        {children}
      </main>
      <Footer siteSettings={layoutSettings} />
    </div>
  );
}
