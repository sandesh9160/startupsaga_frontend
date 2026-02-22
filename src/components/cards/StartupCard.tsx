"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Sparkles, TrendingUp } from "lucide-react";
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
    <article className="group relative bg-white rounded-2xl border border-zinc-100 hover:border-indigo-100 p-5 flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 overflow-hidden">
      <Link href={`/startups/${slug}`} className="absolute inset-0 z-30" />

      {/* Top Section: Logo & Info */}
      <div className="flex items-start gap-4 mb-4 relative z-20">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-zinc-50 flex-shrink-0 relative flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
          {logo || og_image ? (
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              fill
              className="object-contain p-2.5"
              sizes="56px"
              unoptimized={isSvgLogo}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-indigo-500 font-black text-xl">
              {name?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-black text-[16px] text-zinc-900 leading-tight group-hover:text-indigo-600 transition-colors truncate">
            {name}
          </h3>
          <p className="text-zinc-400 text-[11px] font-medium leading-snug mt-1.5 line-clamp-2">
            {tagline || `${displayCategory} startup based in ${displayCity}.`}
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap items-center gap-2 mb-4 relative z-20">
        <span className="px-3 py-1 rounded-full bg-zinc-50 text-zinc-500 text-[9px] font-black uppercase tracking-widest border border-zinc-100">
          {displayCategory}
        </span>
        <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest border border-orange-100 flex items-center gap-1.5">
          <TrendingUp size={10} className="text-orange-400" />
          {displayStage}
        </span>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-zinc-50/80 flex items-center gap-4 relative z-20">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-zinc-300" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{displayCity}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Users size={12} className="text-zinc-300" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{team_size}</span>
        </div>
      </div>

      {/* Visual Polish: Corner Accent */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-50/30 rounded-full blur-2xl group-hover:bg-indigo-100/40 transition-colors" />
    </article>
  );
}
