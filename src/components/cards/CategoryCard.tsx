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

export function CategoryCard({
  slug,
  name,
  icon: Icon,
  startupCount,
  storyCount = 0,
  variant = "card",
}: CategoryCardProps) {
  // Use real story count or default to 0
  const displayStories = storyCount ?? 0;

  if (variant === "banner") {
    // Horizontal Layout (Categories Page)
    return (
      <Link href={`/categories/${slug}`} className="block group h-full">
        <article className="rounded-24 p-5 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-zinc-100 flex items-center gap-5 bg-white">
          {/* Icon Box */}
          <div className="bg-orange-50 h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
            <Icon className="h-7 w-7 text-orange-600" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">
              {displayStories} STORIES • {startupCount} STARTUPS
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Vertical Layout (Default) - Ultra Compact version
  return (
    <Link href={`/categories/${slug}`} className="block group h-full">
      <article className="bg-white rounded-lg p-3 h-full border border-zinc-100/80 shadow-[0_2px_15px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 group-hover:border-orange-100">
        {/* Icon Container - Smaller */}
        <div className="w-10 h-10 rounded-lg bg-[#FFF8F5] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xs border border-orange-50/50">
          <Icon className="h-5 w-5 text-[#D94111]" strokeWidth={2} />
        </div>

        <div className="space-y-0.5">
          <h3 className="font-bold text-[12px] text-zinc-900 group-hover:text-[#D94111] transition-colors tracking-tight leading-tight">
            {name}
          </h3>
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest opacity-80">
            {displayStories} stories
          </p>
        </div>
      </article>
    </Link>
  );
}
