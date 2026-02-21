"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  slug: string;
  name: string;
  icon: LucideIcon;
  startupCount: number;
  storyCount?: number;
  description: string;
  variant?: "card" | "banner";
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  "fintech": { bg: "bg-[#E6F4F1]", text: "text-[#006953]", icon: "text-[#00A884]" },
  "saas": { bg: "bg-[#E8F0FE]", text: "text-[#174EA6]", icon: "text-[#1A73E8]" },
  "ecommerce": { bg: "bg-[#FEF1E8]", text: "text-[#B05500]", icon: "text-[#E67E22]" },
  "edtech": { bg: "bg-[#F3E8FF]", text: "text-[#6A1B9A]", icon: "text-[#8E44AD]" },
  "healthtech": { bg: "bg-[#FEF2F2]", text: "text-[#C62828]", icon: "text-[#E74C3C]" },
  "mobility": { bg: "bg-[#E6F9F9]", text: "text-[#00838F]", icon: "text-[#00BCD4]" },
  "d2c": { bg: "bg-[#FCE7F3]", text: "text-[#AD1457]", icon: "text-[#D81B60]" },
  "agritech": { bg: "bg-[#ECFDF5]", text: "text-[#065F46]", icon: "text-[#059669]" },
  "proptech": { bg: "bg-[#FFFBEB]", text: "text-[#92400E]", icon: "text-[#D97706]" },
  "gaming": { bg: "bg-[#EEF2FF]", text: "text-[#3730A3]", icon: "text-[#4F46E5]" },
  "travel": { bg: "bg-[#FFF1F2]", text: "text-[#9F1239]", icon: "text-[#E11D48]" },
  "cybersecurity": { bg: "bg-[#F8FAFC]", text: "text-[#334155]", icon: "text-[#475569]" },
};

export function CategoryCard({
  slug,
  name,
  icon: Icon,
  startupCount,
  storyCount = 0,
  description,
  variant = "card",
}: CategoryCardProps) {
  // Normalize slug to match keys
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Default to a neutral style if not found
  const style = CATEGORY_STYLES[normalizedSlug] || { bg: "bg-zinc-50", text: "text-zinc-900", icon: "text-zinc-600" };

  // Use real story count or default to 0
  const displayStories = storyCount ?? 0;

  if (variant === "banner") {
    // Horizontal Layout (Categories Page)
    return (
      <Link href={`/categories/${slug}`} className="block group h-full">
        <article className={cn(
          "rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-4",
          style.bg
        )}>
          {/* Icon Box */}
          <div className="bg-white h-12 w-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Icon className={cn("h-6 w-6", style.icon)} strokeWidth={1.5} />
          </div>

          <div className="flex flex-col min-w-0 flex-1 gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className={cn("text-lg font-serif font-bold truncate", style.text)}>
                {name}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 text-zinc-600 shrink-0 whitespace-nowrap bg-white/50 px-2 py-0.5 rounded-full">
                {startupCount} Startups
              </span>
            </div>

            <p className="text-xs leading-snug text-zinc-600 line-clamp-2 font-medium opacity-90 pr-2">
              {description}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Vertical Layout (Homepage - Default)
  return (
    <Link href={`/categories/${slug}`} className="block group h-full">
      <article className="bg-white rounded-2xl p-6 h-full border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4">
        {/* Icon Circle */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner",
          style.bg.replace('bg-', 'bg-opacity-20 bg-') // Lighter background for circle
        )}>
          <Icon className={cn("h-6 w-6", style.icon)} strokeWidth={1.5} />
        </div>

        <div className="space-y-1">
          <h3 className={cn("font-bold text-lg font-serif group-hover:opacity-80 transition-opacity", style.text)}>
            {name}
          </h3>
          <p className="text-xs text-zinc-400 font-medium">
            {displayStories} stories
          </p>
        </div>
      </article>
    </Link>
  );
}
