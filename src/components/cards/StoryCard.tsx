"use client";

import Link from "next/link";
import Image from "next/image";
import { getSafeImageSrc } from "@/lib/images";
import { Clock, User } from "lucide-react";

interface StoryCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  categorySlug?: string;
  city?: string;
  citySlug?: string;
  publishDate?: string;
  featured?: boolean;
  isFeatured?: boolean;
  og_image?: string;
  author?: string;
  author_name?: string;
  read_time?: number;
}

export function StoryCard({
  slug,
  title,
  excerpt,
  thumbnail,
  category,
  categorySlug,
  city,
  publishDate,
  featured = false,
  isFeatured,
  og_image,
  author,
  author_name,
  read_time,
}: StoryCardProps) {
  const thumbnailSrc = getSafeImageSrc(thumbnail || og_image);
  const isSvg = thumbnailSrc.toLowerCase().endsWith(".svg");
  const isFeaturedCard = featured || isFeatured;
  const authorDisplay = author_name || author;
  const readTimeDisplay = read_time ? `${read_time} min read` : null;

  // Featured: full-bleed with gradient text overlay
  if (isFeaturedCard) {
    return (
      <article className="relative overflow-hidden aspect-[16/6] w-full group rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized={isSvg}
        />
        <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent">
          {category && (
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#F2542D] mb-2 block">
              {category}
            </span>
          )}
          <Link href={`/stories/${slug}`} className="font-serif font-bold text-3xl lg:text-4xl mb-3 text-white hover:text-orange-200 transition-colors line-clamp-2 leading-tight block">
            {title}
          </Link>
          <time className="text-[10px] font-bold text-zinc-300 opacity-70">{publishDate}</time>
        </div>
      </article>
    );
  }

  // Standard card
  return (
    <article className="flex flex-col bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      {/* Thumbnail */}
      <Link href={`/stories/${slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 block flex-shrink-0">
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={isSvg}
        />
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {category && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D94111] mb-2 block">
            {category}
          </span>
        )}

        <Link
          href={`/stories/${slug}`}
          className="font-bold text-[#0F172A] text-[15px] leading-snug line-clamp-2 hover:text-[#D94111] transition-colors mb-2 block"
        >
          {title}
        </Link>

        {excerpt && (
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed flex-1">
            {excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 text-[11px] text-zinc-400 font-medium">
          {authorDisplay && (
            <span className="flex items-center gap-1 truncate">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{authorDisplay}</span>
            </span>
          )}
          {authorDisplay && readTimeDisplay && <span className="flex-shrink-0">·</span>}
          {readTimeDisplay && (
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock className="h-3 w-3" />
              {readTimeDisplay}
            </span>
          )}
          {!authorDisplay && !readTimeDisplay && publishDate && (
            <time className="text-zinc-400">{publishDate}</time>
          )}
        </div>
      </div>
    </article>
  );
}
