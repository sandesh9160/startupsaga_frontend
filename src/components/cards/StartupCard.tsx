"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Sparkles } from "lucide-react";
import { getSafeImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

interface StartupCardProps {
  slug: string;
  name: string;
  tagline?: string;
  logo: string;
  category: any;
  categorySlug?: string;
  city: any;
  citySlug?: string;
  website?: string;
  website_url?: string;
  stage?: string;
  funding_stage?: string;
  team_size?: string;
}

export function StartupCard({
  slug,
  name,
  tagline,
  logo,
  category,
  city,
  stage,
  funding_stage,
  team_size = "100+",
  og_image,
  is_featured,
}: StartupCardProps & { og_image?: string; is_featured?: boolean }) {
  const displayCategory = typeof category === 'object' ? category.name : category;
  const displayCity = typeof city === 'object' ? city.name : city;
  const logoSrc = getSafeImageSrc(logo || og_image);
  const isSvgLogo = logoSrc.toLowerCase().endsWith(".svg");
  const displayStage = funding_stage ?? stage ?? "Series A";

  return (
    <article className="group relative bg-white rounded-xl border border-zinc-100 hover:border-orange-200/50 p-3 flex flex-col h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50/20 to-transparent -mr-12 -mt-12 rounded-full transition-transform group-hover:scale-125" />

      <Link href={`/startups/${slug}`} className="absolute inset-0 z-30" />

      {is_featured && (
        <div className="absolute top-2.5 right-2.5 z-20">
          <div className="bg-amber-100/50 backdrop-blur-sm text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles size={7} fill="currentColor" />
            Featured
          </div>
        </div>
      )}

      {/* Top Section: Logo & Name */}
      <div className="flex gap-2.5 mb-2.5 relative z-20">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-zinc-100 flex-shrink-0 relative flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow group-hover:scale-105 duration-300">
          {logo || og_image ? (
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              fill
              className="object-contain p-1.5"
              sizes="36px"
              unoptimized={isSvgLogo}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-400 font-bold text-sm">
              {name?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-bold text-[13px] text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors truncate">
            {name}
          </h3>
          <p className="text-zinc-500 text-[10px] leading-snug mt-0.5 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {tagline || `${displayCategory} startup.`}
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap items-center gap-1 mt-auto mb-2.5 relative z-20">
        <span className="px-1.5 py-0.5 rounded-md bg-zinc-50 text-zinc-500 text-[8px] font-black uppercase tracking-widest border border-zinc-100/50">
          {displayCategory}
        </span>
        <span className="px-1.5 py-0.5 rounded-md bg-orange-50/80 text-orange-600 text-[8px] font-black uppercase tracking-widest border border-orange-100/30 flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
          {displayStage}
        </span>
      </div>

      {/* Footer Details */}
      <div className="pt-2 border-t border-zinc-50 flex items-center justify-between relative z-20 opacity-70 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-zinc-400" />
          <span className="text-[9px] font-bold text-zinc-500 tracking-tight">{displayCity}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={10} className="text-zinc-400" />
          <span className="text-[9px] font-bold text-zinc-500 tracking-tight">{team_size}</span>
        </div>
      </div>
    </article>
  );
}

