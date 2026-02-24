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
        <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/40 to-transparent">
          {category && (
            <span className="text-[10px] font-bold text-[#FF4F18] mb-2 block tracking-wider">
              {category}
            </span>
          )}
          <Link href={`/stories/${slug}`} className="font-serif font-semibold text-3xl lg:text-4xl mb-4 text-white hover:text-orange-200 transition-colors line-clamp-2 leading-[1.1] block">
            {title}
          </Link>

          <div className="flex items-center gap-4 text-[12px] font-medium text-white/70">
            {authorDisplay && (
              <span className="flex items-center gap-1.5 truncate">
                <User size={13} className="text-[#FF4F18]" />
                <span className="truncate">{authorDisplay}</span>
              </span>
            )}
            {readTimeDisplay && (
              <span className="flex items-center gap-1.5 flex-shrink-0">
                <Clock size={13} className="text-[#FF4F18]" />
                {readTimeDisplay}
              </span>
            )}
            <span className="opacity-40 ml-1 font-bold tracking-widest uppercase text-[10px]">{publishDate}</span>
          </div>
        </div>
      </article>
    );
  }

  // Standard card
  return (
    <article className="flex flex-col bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 group">
      {/* Thumbnail */}
      <Link href={`/stories/${slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-50 block flex-shrink-0">
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized={isSvg}
        />
      </Link>

      {/* Body */}
      <div className="p-7 flex flex-col flex-1">
        {category && (
          <span className="text-[11px] font-bold text-[#FF4F18] mb-2 block tracking-wider">
            {category}
          </span>
        )}

        <Link
          href={`/stories/${slug}`}
          className="font-serif font-semibold text-[#0F172A] text-xl leading-snug line-clamp-2 hover:text-[#FF4F18] transition-colors mb-2 block"
        >
          {title}
        </Link>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-[12px] font-medium text-zinc-500 mb-4">
          {authorDisplay && (
            <span className="flex items-center gap-1.5 truncate">
              <User size={14} className="text-[#FF4F18]/80" />
              <span className="truncate text-zinc-700 font-semibold">{authorDisplay}</span>
            </span>
          )}
          {readTimeDisplay && (
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <Clock size={14} className="text-[#FF4F18]/80" />
              {readTimeDisplay}
            </span>
          )}
        </div>

        {excerpt && (
          <p className="text-[14px] text-zinc-400 font-medium leading-relaxed line-clamp-2 mb-4 flex-1">
            {excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
          <time className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">{publishDate}</time>
        </div>
      </div>
    </article>
  );
}
