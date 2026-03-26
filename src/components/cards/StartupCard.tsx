import Link from "next/link";
import { CalendarDays, MapPin, TrendingUp, Users } from "lucide-react";
import { getSafeImageSrc } from "@/lib/images";
import { Category, City } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";

interface StartupCardProps {
  slug: string;
  name: string;
  tagline?: string;
  logo: string;
  category: string | Category;
  categorySlug?: string;
  city: string | City;
  citySlug?: string;
  website?: string;
  website_url?: string;
  stage?: string;
  funding_stage?: string;
  team_size?: string;
  founded_year?: string | number;
  priority?: boolean;
}

export function StartupCard({
  slug,
  name,
  logo,
  category,
  city,
  stage,
  funding_stage,
  team_size = "100+",
  founded_year,
  og_image,
  priority = false,
}: StartupCardProps & { og_image?: string; is_featured?: boolean }) {
  const displayCategory = (typeof category === 'object' && category) ? category.name : category;
  const displayCity = (typeof city === 'object' && city) ? city.name : city;
  const logoSrc = getSafeImageSrc(logo || og_image);
  const displayStage = funding_stage ?? stage ?? "Series A";

  return (
    <article className="group relative bg-white rounded-2xl border border-zinc-300 p-5 flex flex-col h-full min-h-[142px] transition-all duration-300 hover:shadow-xl hover:shadow-zinc-300/50 hover:-translate-y-1 overflow-hidden shadow-sm">
      <Link href={`/startups/${slug}`} className="absolute inset-0 z-30" />

      {/* Top Section: Logo & Info */}
      <div className="flex items-start gap-4 mb-3 relative z-20">
        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden bg-white border border-zinc-100 flex-shrink-0 relative flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105">
          {logo || og_image ? (
            <SmartImage
              src={logoSrc}
              alt={`${name} logo`}
              fill
              className="object-contain p-1.5 transition-all duration-300"
              style={{ objectFit: 'contain' }}
              sizes="50px"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-[#FF4F18] font-bold text-lg select-none">
              {name?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-serif font-bold text-[17px] leading-tight text-[#0F172A] mt-1 transition-colors line-clamp-2">
            {name}
          </h3>
          <p className="text-[11px] font-bold text-[#FF4F18]/80 uppercase tracking-wider mt-1">
            {displayCategory}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto relative z-20">
        <div className="flex items-center gap-4 min-w-0 text-[11px] font-medium text-zinc-400">
          <span className="inline-flex items-center gap-1.5 truncate">
            <MapPin size={12} className="text-zinc-300" />
            <span className="truncate">{displayCity}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Users size={12} className="text-zinc-300" />
            {team_size}
          </span>
          {founded_year && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <CalendarDays size={12} className="text-zinc-300" />
              {founded_year}
            </span>
          )}
        </div>
        <span className="px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#FF4F18] text-[10px] font-bold flex items-center gap-1">
          <TrendingUp size={10} className="text-[#FF4F18]/70" />
          {displayStage}
        </span>
      </div>
    </article>
  );
}
