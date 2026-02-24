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
  website,
  website_url,
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
    <article className="group relative bg-white rounded-2xl border border-zinc-100 p-4 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 overflow-hidden shadow-sm">
      <Link href={`/startups/${slug}`} className="absolute inset-0 z-30" />

      {/* Top Section: Logo & Info */}
      <div className="flex items-start gap-4 mb-4 relative z-20">
        <div className="w-[60px] h-[60px] rounded-lg overflow-hidden bg-white border border-zinc-100 flex-shrink-0 relative flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105">
          {logo || og_image ? (
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              fill
              className="object-contain p-2 group-hover:p-1 transition-all duration-300"
              sizes="60px"
              unoptimized={isSvgLogo}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-[#FF4F18] font-bold text-xl select-none">
              {name?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-bold text-[18px] md:text-[20px] leading-tight text-[#0F172A] mb-1 transition-colors truncate">
            {name}
          </h3>
          <p className="text-[13px] text-zinc-400 font-medium leading-tight line-clamp-2">
            {tagline || `${displayCategory} startup based in ${displayCity}.`}
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap items-center gap-2 mb-5 relative z-20">
        <span className="px-2.5 py-1 rounded-lg bg-[#F8F9FA] text-zinc-900 text-[11px] font-semibold">
          {displayCategory}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FFF0EB] text-[#FF4F18] text-[11px] font-semibold flex items-center gap-1.5">
          <TrendingUp size={12} className="text-[#FF4F18]/70" />
          {displayStage}
        </span>
      </div>

      {/* Footer Info */}
      <div className="mt-auto flex items-center gap-4 relative z-20">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-zinc-300" />
          <span className="text-[11px] font-medium text-zinc-400">{displayCity}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-zinc-300" />
          <span className="text-[11px] font-medium text-zinc-400">{team_size}</span>
        </div>
      </div>
    </article>
  );
}
