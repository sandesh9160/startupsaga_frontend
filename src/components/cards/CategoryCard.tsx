"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand-consistent palette for categories (used on homepage)
const BRAND_STYLE = {
  bg: "bg-[#FFF5F0]", // Very light orange/peach
  text: "text-[#0F172A]", // Dark navy for text
  icon: "text-[#FF4F18]", // High-contrast brand orange
  border: "border-[#FF4F18]/10"
};

// Pastel background palette — cycles through colors per card (used on categories page)
const PALETTES = [
  { bg: "bg-[#EBF7F5]", text: "text-[#006953]", icon: "text-[#00A884]" }, // Mint/Green
  { bg: "bg-[#F0F5FF]", text: "text-[#174EA6]", icon: "text-[#1A73E8]" }, // Blue
  { bg: "bg-[#FFF4ED]", text: "text-[#B05500]", icon: "text-[#E67E22]" }, // Orange
  { bg: "bg-[#F3E8FF]", text: "text-[#6A1B9A]", icon: "text-[#8E44AD]" }, // Purple
  { bg: "bg-[#FEF2F2]", text: "text-[#C62828]", icon: "text-[#E74C3C]" }, // Red
  { bg: "bg-[#E6F9F9]", text: "text-[#00838F]", icon: "text-[#00BCD4]" }, // Teal
];

interface CategoryCardProps {
  slug: string;
  name: string;
  icon: LucideIcon;
  startupCount?: number;
  storyCount?: number;
  description?: string;
  variant?: "compact" | "horizontal";
  paletteIndex?: number;
}

export function CategoryCard({
  slug,
  name,
  icon: Icon,
  startupCount = 0,
  storyCount = 0,
  description,
  variant = "compact",
  paletteIndex = 0,
}: CategoryCardProps) {
  // Choose style based on paletteIndex for rotation
  const style = PALETTES[paletteIndex % PALETTES.length];

  // Horizontal variant — Used on Categories page ("exact style")
  if (variant === "horizontal") {
    return (
      <Link href={`/categories/${slug}`} className="block group h-full">
        <article
          className={cn(
            "rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5 flex flex-col gap-5",
            style.bg
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <Icon className={cn("h-7 w-7", style.icon)} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-serif font-semibold text-2xl text-[#0F172A] leading-none tracking-tight mb-2 truncate">
                {name}
              </h3>
              <p className="text-[12px] font-semibold text-zinc-500 flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#0F172A]">{startupCount.toLocaleString()}</span> startups
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="text-[#0F172A]">{storyCount.toLocaleString()}</span> stories
              </p>
            </div>
          </div>

          {description && (
            <p className="text-zinc-500 text-[14px] leading-relaxed line-clamp-2 font-medium">
              {description.replace(/<[^>]*>/g, '')}
            </p>
          )}
        </article>
      </Link>
    );
  }

  // Compact vertical card — Used on homepage (Previous orange style)
  return (
    <Link href={`/categories/${slug}`} className="block group h-full">
      <article
        className="bg-white rounded-xl p-4 h-full border border-zinc-100 shadow-sm hover:shadow-md hover:shadow-orange-50/50 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3"
      >
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner",
            BRAND_STYLE.bg
          )}
        >
          <Icon className={cn("h-5 w-5", BRAND_STYLE.icon)} strokeWidth={1.5} />
        </div>
        <div className="space-y-1 px-2">
          <h3 className="font-serif font-semibold text-xl text-[#0F172A] leading-snug tracking-tight">
            {name}
          </h3>
          <p className="text-[13px] text-zinc-500 font-medium">
            {storyCount || 0} stories
          </p>
        </div>
      </article>
    </Link>
  );
}
