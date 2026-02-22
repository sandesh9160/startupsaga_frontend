"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

// Pastel background palette — cycles through colors per card
const CARD_PALETTES = [
  { bg: "#EDF7ED", icon: "#4CAF50", border: "#D4EDDA" },  // green
  { bg: "#FFF3E0", icon: "#FF7043", border: "#FFE0B2" },  // orange
  { bg: "#E8F4FD", icon: "#1E88E5", border: "#BBDEFB" },  // blue
  { bg: "#F3E5F5", icon: "#7B1FA2", border: "#E1BEE7" },  // purple
  { bg: "#FCE4EC", icon: "#E91E63", border: "#F8BBD0" },  // pink
  { bg: "#E0F2F1", icon: "#00796B", border: "#B2DFDB" },  // teal
  { bg: "#FFFDE7", icon: "#F57F17", border: "#FFF9C4" },  // yellow
  { bg: "#E8EAF6", icon: "#3949AB", border: "#C5CAE9" },  // indigo
  { bg: "#FBE9E7", icon: "#BF360C", border: "#FFCCBC" },  // deep orange
  { bg: "#E0F7FA", icon: "#00838F", border: "#B2EBF2" },  // cyan
];

interface CategoryCardProps {
  slug: string;
  name: string;
  icon: LucideIcon;
  startupCount?: number;
  storyCount?: number;
  description?: string;
  variant?: "card" | "banner";
  paletteIndex?: number;
}

export function CategoryCard({
  slug,
  name,
  icon: Icon,
  startupCount = 0,
  storyCount = 0,
  description,
  variant = "card",
  paletteIndex = 0,
}: CategoryCardProps) {
  const palette = CARD_PALETTES[paletteIndex % CARD_PALETTES.length];

  // Banner variant — used on /categories page
  if (variant === "banner") {
    return (
      <Link href={`/categories/${slug}`} className="block group h-full">
        <article
          className="rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md border flex flex-col gap-3"
          style={{ backgroundColor: palette.bg, borderColor: palette.border }}
        >
          {/* Icon + Name row */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
            >
              <Icon className="h-5 w-5" style={{ color: palette.icon }} strokeWidth={1.8} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base group-hover:text-[#D94111] transition-colors leading-tight">
              {name}
            </h3>
          </div>

          {/* Counts */}
          <p className="text-[11px] font-semibold text-zinc-500">
            {startupCount} startups &nbsp;•&nbsp; {storyCount} stories
          </p>

          {/* Description */}
          {description && (
            <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </article>
      </Link>
    );
  }

  // Compact vertical card (used on homepage / category grid)
  return (
    <Link href={`/categories/${slug}`} className="block group h-full">
      <article
        className="rounded-2xl p-4 h-full border flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        style={{ backgroundColor: palette.bg, borderColor: palette.border }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
        >
          <Icon className="h-6 w-6" style={{ color: palette.icon }} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-bold text-[13px] text-[#0F172A] group-hover:text-[#D94111] transition-colors leading-tight">
            {name}
          </h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
            {storyCount} stories
          </p>
        </div>
      </article>
    </Link>
  );
}
