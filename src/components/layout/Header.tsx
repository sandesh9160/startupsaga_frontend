"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X, Rocket, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";
import dynamic from "next/dynamic";



// Lazy-load DropdownMenu to avoid SSR hydration mismatches from Radix
const DropdownMenu = dynamic(
  () => import("@/components/ui/dropdown-menu").then((mod) => ({ default: mod.DropdownMenu })),
  { ssr: false }
);
const DropdownMenuContent = dynamic(
  () => import("@/components/ui/dropdown-menu").then((mod) => ({ default: mod.DropdownMenuContent })),
  { ssr: false }
);
const DropdownMenuItem = dynamic(
  () => import("@/components/ui/dropdown-menu").then((mod) => ({ default: mod.DropdownMenuItem })),
  { ssr: false }
);
const DropdownMenuTrigger = dynamic(
  () => import("@/components/ui/dropdown-menu").then((mod) => ({ default: mod.DropdownMenuTrigger })),
  { ssr: false }
);

interface HeaderProps {
  initialNav?: any[];
  siteSettings?: any;
}

export function Header({ initialNav = [], siteSettings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Fallback links if the database is empty
  const defaults = [
    { id: 'home', label: "Home", url: "/", children: [] },
    { id: 'stories', label: "Stories", url: "/stories", children: [] },
    { id: 'startups', label: "Startups", url: "/startups", children: [] },
    { id: 'categories', label: "Categories", url: "/categories", children: [] },
    { id: 'cities', label: "Cities", url: "/cities", children: [] },
  ];

  const [navLinks, setNavLinks] = useState<any[]>(initialNav.length > 0 ? initialNav : defaults);
  const headerRef = useRef<HTMLElement>(null);
  const isScrolledRef = useRef(false);

  // Close mobile menu on route change (App Router keeps layout mounted between pages)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== isScrolledRef.current) {
        isScrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    // If we already have initial navigation from server, don't fetch again
    if (initialNav.length > 0) return;

    fetch(`${API_BASE_URL}/navigation/?position=header&hierarchical=true`)
      .then(res => res.ok ? res.json() : null)
      .then(items => { if (items && items.length > 0) setNavLinks(items); })
      .catch(err => console.error("Failed to load header navigation client-side", err));
  }, [isMounted]);

  const formatUrl = (url: string | null | undefined) => {
    if (!url) return "/";
    if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("/") || url.startsWith("#")) return url;
    return `/${url}`;
  };

  /**
   * Renders a single nav link. 
   */
  const renderNavLink = (link: any) => {
    const hasChildren = link.children && link.children.length > 0;
    const style = link.settings || {};

    if (hasChildren) {
      if (!isMounted) {
        return (
          <Link
            key={link.id}
            href={formatUrl(link.url)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-all flex items-center gap-1.5"
            style={{
              color: style.color || undefined,
            }}
          >
            {link.label}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Link>
        );
      }

      return (
        <DropdownMenu key={link.id}>
          <DropdownMenuTrigger asChild>
            <button
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-all flex items-center gap-1.5 outline-none group"
              style={{
                color: style.color || undefined,
              }}
              suppressHydrationWarning
            >
              {link.label}
              <ChevronDown className="h-3.5 w-3.5 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-xl border-zinc-300 bg-white animate-in fade-in zoom-in-95 duration-200">
            {link.children.map((child: any) => (
              <DropdownMenuItem key={child.id} asChild className="rounded-lg focus:bg-zinc-50 focus:text-zinc-900 p-0 overflow-hidden">
                <Link
                  href={formatUrl(child.url)}
                  className="flex items-center w-full px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{
                    color: child.settings?.color || undefined,
                  }}
                >
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={link.id}
        href={formatUrl(link.url)}
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-all relative group"
        style={{
          color: style.color || undefined,
        }}
      >
        {link.label}
      </Link>
    );
  };

  // Use a completely stable height to prevent any layout shifts regardless of scroll state
  const headerClass = cn(
    "sticky top-0 z-50 transition-all duration-300 w-full",
    isMounted && scrolled
      ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm py-4"
      : "bg-white border-b border-zinc-200/50 py-4"
  );

  return (
    <header ref={headerRef} className={headerClass}>
      <div className="container-wide">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="transition-transform active:scale-95">
              <Logo initialSettings={siteSettings} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" suppressHydrationWarning>
              {navLinks.map(renderNavLink)}
            </nav>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl h-11 px-6 shadow-md shadow-orange-600/20 group" asChild suppressHydrationWarning>
              <Link href="/submit" className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight capitalize">Submit Startup</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            suppressHydrationWarning
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-white border border-zinc-300 rounded-2xl p-5 shadow-xl">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const hasChildren = link.children && link.children.length > 0;

                return (
                  <div key={link.id} className="flex flex-col">
                    <Link
                      href={formatUrl(link.url)}
                      className="text-base font-semibold text-zinc-900 hover:bg-zinc-50 px-4 py-3 rounded-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {hasChildren && (
                      <div className="pl-6 flex flex-col border-l border-zinc-300 ml-4 gap-1 mb-2">
                        {link.children.map((child: any) => (
                          <Link
                            key={child.id}
                            href={formatUrl(child.url)}
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 py-2 px-3 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="h-px bg-zinc-300 my-4" />
              <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-12" asChild>
                <Link href="/submit" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                  <span className="font-bold text-sm">Submit Journey</span>
                  <Rocket className="h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

