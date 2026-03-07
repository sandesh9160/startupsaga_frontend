"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Twitter, Linkedin, Instagram, Mail, Globe } from "lucide-react";

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

// Fallback static data
const DEFAULT_COLUMNS = [
  {
    label: "Platform",
    children: [
      { label: "Stories", url: "/stories" },
      { label: "Startups", url: "/startups" },
      { label: "Cities", url: "/cities" },
      { label: "Categories", url: "/categories" },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "About", url: "/about" },
      { label: "Submit Startup", url: "/submit" },
      { label: "Contact", url: "/contact" },
    ],
  },
  {
    label: "Legal",
    children: [
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Terms of Service", url: "/terms" },
    ],
  },
];

const DEFAULT_SOCIALS = [
  { platform: "twitter", url: "https://twitter.com/startupsaga" },
  { platform: "linkedin", url: "https://linkedin.com/company/startupsaga" },
  { platform: "instagram", url: "https://instagram.com/startupsaga" },
  { platform: "email", url: "mailto:hello@startupsaga.in" },
];

interface NavItem {
  label?: string;
  url?: string | null;
  order?: number;
  parent?: unknown;
  children?: NavItem[];
  platform?: string;
}

interface FooterSiteSettings {
  socials?: Array<{ platform: string; url: string }>;
  footer_tagline?: string;
  footer_copyright?: string;
  footer_bg_color?: string;
  [key: string]: unknown;
}

interface FooterProps {
  siteSettings?: FooterSiteSettings;
  /** Pre-fetched footer nav columns from the server (avoids client-side API call) */
  initialNav?: NavItem[];
}

export function Footer({ siteSettings, initialNav }: FooterProps) {
  // Use server-provided nav data if available, otherwise fall back to defaults.
  // This eliminates the client-side fetch that was blocking rendering.
  const columns = (initialNav && initialNav.length > 0) ? initialNav : DEFAULT_COLUMNS as NavItem[];
  const socials = siteSettings?.socials || DEFAULT_SOCIALS;
  const tagline = siteSettings?.footer_tagline || "Discovering and celebrating the incredible startup journeys across India. Every founder has a story worth telling.";
  const copyright = siteSettings?.footer_copyright || "© 2026 StartupSaga.in. All rights reserved.";
  const bgColor = siteSettings?.footer_bg_color || "#09090b";

  const formatUrl = (url: string | null | undefined) => {
    if (!url) return "/";
    if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("/") || url.startsWith("#")) return url;
    return `/${url}`;
  };

  return (
    <footer className="text-white transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div className="container-wide py-16 md:py-20 mt-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              <Logo variant="light" showText={true} initialSettings={siteSettings} />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{tagline}</p>
            <div className="flex items-center gap-4">
              {socials.filter((s: NavItem) => !!s.platform).map((social: NavItem, i: number) => (
                <a
                  key={i}
                  href={social.url || "#"}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-accent transition-colors"
                  aria-label={social.platform || "social link"}
                >
                  {SOCIAL_ICON_MAP[social.platform ?? ''] || <Globe className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-zinc-200">
                {col.label}
              </h4>
              <ul className="space-y-3">
                {(col.children || []).map((link: NavItem, j: number) => (
                  <li key={`${i}-${j}`}>
                    <Link
                      href={formatUrl(link.url)}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">{copyright}</p>
            {/* <p className="text-sm text-zinc-500">Made with  for Indian Startups</p> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
