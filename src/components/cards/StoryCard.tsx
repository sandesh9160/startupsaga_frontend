"use client";

import Link from "next/link";
import Image from "next/image";
import { getSafeImageSrc } from "@/lib/images";

interface StoryCardProps {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  categorySlug?: string;
  city: string;
  citySlug?: string;
  publishDate: string;
  featured?: boolean;
  isFeatured?: boolean;
  og_image?: string;
}

export function StoryCard({
  slug,
  title,
  excerpt,
  thumbnail,
  category,
  categorySlug,
  city,
  citySlug,
  publishDate,
  featured = false,
  isFeatured,
  og_image,
}: StoryCardProps) {
  const thumbnailSrc = getSafeImageSrc(thumbnail || og_image);
  const isSvgThumbnail = thumbnailSrc.toLowerCase().endsWith(".svg");
  const isFeaturedCard = featured || isFeatured;

  // Compact layout classes
  const containerClass = isFeaturedCard
    ? "relative overflow-hidden aspect-[21/9] w-full group rounded-xl"
    : "flex flex-col bg-white rounded-lg border border-zinc-100 shadow-sm w-full overflow-hidden hover:shadow-md transition-shadow";

  const paddingClass = isFeaturedCard
    ? "absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white"
    : "p-3 space-y-1.5";

  return (
    <article className={containerClass}>
      <div className={isFeaturedCard ? "absolute inset-0" : "relative aspect-[16/9] w-full overflow-hidden"}>
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={isSvgThumbnail}
        />
        {!isFeaturedCard && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      <div className={paddingClass}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {categorySlug && (
            <Link href={`/categories/${categorySlug}`} className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">
              {category}
            </Link>
          )}
          {citySlug && (
            <Link href={`/cities/${citySlug}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              {city}
            </Link>
          )}
        </div>
        <Link href={`/stories/${slug}`} className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
          {title}
        </Link>
        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-1">{excerpt}</p>
        <time className="text-[10px] text-gray-400 mt-2 block">{publishDate}</time>
      </div>

      {/* Full overlay link */}
      <Link href={`/stories/${slug}`} className="absolute inset-0 z-10" aria-label={`Read story: ${title}`} />
    </article>
  );
}
