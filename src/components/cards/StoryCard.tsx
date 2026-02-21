"use client";

import Link from "next/link";
import Image from "next/image";
import { getSafeImageSrc } from "@/lib/images";
import { User } from "lucide-react";

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

  if (isFeaturedCard) {
    return (
      <article className="card-editorial relative overflow-hidden aspect-[16/10] md:aspect-[2/1] group">
        {/* Main image background */}
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          unoptimized={isSvgThumbnail}
          priority
        />
        <div className="absolute inset-0 story-card-overlay" />

        {/* Content Content - Not wrapped in main link directly */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none">
          {/* Interactive elements must be pointer-events-auto */}
          <div className="flex items-center gap-3 mb-3 pointer-events-auto">
            {categorySlug && (
              <Link
                href={`/categories/${categorySlug}`}
                className="badge-category relative z-20"
              >
                {category}
              </Link>
            )}
            {citySlug && (
              <Link
                href={`/cities/${citySlug}`}
                className="badge-city relative z-20"
              >
                {city}
              </Link>
            )}
          </div>

          <Link href={`/stories/${slug}`} className="block pointer-events-auto group-hover:text-accent transition-colors">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h2>
          </Link>

          <p className="text-white/80 text-sm md:text-sm max-w-2xl line-clamp-2 mb-3">
            {excerpt}
          </p>
          <time className="text-white/60 text-xs" suppressHydrationWarning>{publishDate}</time>
        </div>

        {/* Full card clickable overlay - carefully positioned below other links */}
        <Link
          href={`/stories/${slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Read story: ${title}`}
        />
      </article>
    );
  }

  return (
    <article className="h-full flex flex-col group relative bg-transparent transition-all duration-300">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-3 shadow-sm group-hover:shadow-md transition-shadow">
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          unoptimized={isSvgThumbnail}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="flex flex-col flex-1 px-1">
        <div className="mb-2 relative z-20 flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#D94111]" />
          {category && (
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D94111]">
              {category}
            </span>
          )}
        </div>

        <h3 className="text-[14px] font-bold text-zinc-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug tracking-tight">
          <Link href={`/stories/${slug}`} className="before:absolute before:inset-0 before:z-30 focus:outline-none">
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-semibold tracking-tight pt-2 border-t border-zinc-50 mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
          <span>8 min read</span>
          <span className="w-0.5 h-0.5 rounded-full bg-zinc-300" />
          <time suppressHydrationWarning>{publishDate || 'Feb 13, 2026'}</time>
        </div>
      </div>
    </article>
  );
}
