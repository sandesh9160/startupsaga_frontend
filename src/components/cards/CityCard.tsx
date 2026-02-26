"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { getSafeImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

// Pastel background palette — cycles through colors per card (used as fallback/overlay text color)
const CARD_PALETTES = [
  { bg: "#E8F4FD", icon: "#1E88E5", border: "#BBDEFB" },  // blue
  { bg: "#FCE4EC", icon: "#E91E63", border: "#F8BBD0" },  // pink
  { bg: "#E0F2F1", icon: "#00796B", border: "#B2DFDB" },  // teal
  { bg: "#EDF7ED", icon: "#4CAF50", border: "#D4EDDA" },  // green
  { bg: "#FFF3E0", icon: "#FF7043", border: "#FFE0B2" },  // orange
  { bg: "#F3E5F5", icon: "#7B1FA2", border: "#E1BEE7" },  // purple
  { bg: "#FFFDE7", icon: "#F57F17", border: "#FFF9C4" },  // yellow
  { bg: "#E8EAF6", icon: "#3949AB", border: "#C5CAE9" },  // indigo
  { bg: "#FBE9E7", icon: "#BF360C", border: "#FFCCBC" },  // deep orange
  { bg: "#E0F7FA", icon: "#00838F", border: "#B2EBF2" },  // cyan
];

interface CityCardProps {
  slug: string;
  name: string;
  image?: string;
  startupCount?: number;
  storyCount?: number;
  unicornCount?: number;
  tier?: string;
  paletteIndex?: number;
  className?: string;
  variant?: 'compact' | 'featured';
  description?: string;
  topSectors?: string[];
  fundingAmount?: string;
}

export function CityCard({
  slug,
  name,
  image,
  startupCount = 0,
  storyCount = 0,
  unicornCount = 0,
  tier,
  paletteIndex = 0,
  className,
  variant = 'compact',
  description,
  topSectors = [],
  fundingAmount,
}: CityCardProps) {
  // Use sum of char codes to reliably pick a color based on city name
  const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = CARD_PALETTES[charSum % CARD_PALETTES.length];

  if (variant === 'featured') {
    return (
      <Link href={`/cities/${slug}`} className={cn("block group h-full", className)}>
        <article className="bg-white rounded-2xl overflow-hidden border border-zinc-300 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
          {/* Top Image Section */}
          <div className="relative h-48 md:h-56 w-full overflow-hidden">
            {image ? (
              <SafeImage
                src={getSafeImageSrc(image)}
                alt={name}
                fallbackLabel={name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: palette.bg }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Tier Badge */}
            {tier && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#FF4F18] text-white text-[10px] font-bold tracking-wider uppercase z-20">
                Tier {tier}
              </div>
            )}

            {/* Overlaid Info */}
            <div className="absolute bottom-6 left-6 right-6 text-white z-20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5 text-[#FF4F18] fill-[#FF4F18]" />
                <h3 className="text-2xl md:text-3xl font-bold font-serif">{name}</h3>
              </div>
              <div className="flex items-center gap-3 text-[12px] font-medium text-white/90">
                <span>{startupCount.toLocaleString()} startups</span>
                <span className="opacity-40">•</span>
                <span>{unicornCount} unicorns</span>
              </div>
            </div>
          </div>

          {/* Bottom Content Section */}
          <div className="p-5 flex flex-col flex-grow">
            <p className="text-zinc-600 text-[15px] leading-relaxed mb-4 line-clamp-2 font-medium">
              {description || `Discover the thriving startup ecosystem of ${name}, home to innovative founders and high-growth companies.`}
            </p>

            <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Top sectors:</span>
                <div className="flex flex-wrap gap-2">
                  {(topSectors.length > 0 ? topSectors : ["SaaS", "Fintech"]).slice(0, 2).map(sector => (
                    <span key={sector} className="px-3 py-1 rounded-full bg-zinc-50 text-zinc-600 text-[10px] font-bold border border-zinc-100">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-[#FF4F18] font-black text-sm tracking-tight">
                {fundingAmount || "$1.2B+"}
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/cities/${slug}`} className={cn("block group h-full", className)}>
      <article
        className="relative rounded-2xl h-32 md:h-40 border overflow-hidden flex flex-col justify-end text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        style={{ borderColor: image ? 'transparent' : palette.border, backgroundColor: palette.bg }}
      >
        {/* Full Background Image */}
        {image && (
          <SafeImage
            src={getSafeImageSrc(image)}
            alt={name}
            fallbackLabel={name}
            fill
            unoptimized={getSafeImageSrc(image).endsWith(".svg")}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Gradient Overlay for Text Readability when image is present */}
        {image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        )}

        {/* Tier Badge */}
        {tier && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-wider uppercase z-20">
            Tier {tier}
          </div>
        )}

        {/* Text Content */}
        <div className={cn("relative z-20 p-4 md:p-5 w-full", image ? "" : "h-full flex flex-col justify-center items-center text-center")}>
          {!image && (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-white/60 shadow-sm">
              <MapPin className="h-6 w-6" style={{ color: palette.icon }} strokeWidth={1.8} />
            </div>
          )}

          <h3 className={cn("font-serif font-bold text-2xl leading-snug mb-1.5", image ? "text-white" : "text-[#0F172A]")}>
            {name}
          </h3>
          <p className={cn("text-[13px] font-medium leading-relaxed", image ? "text-white/80" : "text-zinc-500")}>
            {startupCount} startups
          </p>
        </div>
      </article>
    </Link>
  );
}
