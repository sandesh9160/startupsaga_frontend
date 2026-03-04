import Link from "next/link";
import Image from "next/image";
import { getSafeImageSrc } from "@/lib/images";
import { Clock, User } from "lucide-react";

import { Category, City } from "@/types";

interface StoryCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string | Category;
  categorySlug?: string;
  city?: string | City;
  citySlug?: string;
  publishDate?: string;
  featured?: boolean;
  isFeatured?: boolean;
  og_image?: string;
  author?: string;
  author_name?: string;
  read_time?: number;
  priority?: boolean;
}

export function StoryCard({
  slug,
  title,
  excerpt,
  thumbnail,
  category,
  publishDate,
  og_image,
  author,
  author_name,
  read_time,
  priority = false,
  variant = 'standard',
}: StoryCardProps & { variant?: 'standard' | 'overlay' }) {
  const thumbnailSrc = getSafeImageSrc(thumbnail || og_image);
  const isOverlay = variant === 'overlay';
  const authorDisplay = author_name || author;
  const readTimeDisplay = read_time ? `${read_time} min read` : null;
  const categoryName = typeof category === 'string' ? category : category?.name;

  // Featured: full-bleed with gradient text overlay
  if (isOverlay) {
    return (
      <article className="relative overflow-hidden aspect-[16/6] w-full group rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 1400px) 100vw, 1400px"
        />
        <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/40 to-transparent">
          {categoryName && (
            <span className="text-[10px] font-bold text-[#FF4F18] mb-2 block tracking-wider">
              {categoryName}
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
    <article className="flex flex-col bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-zinc-300/50 hover:-translate-y-1 transition-all duration-300 group">
      {/* Thumbnail */}
      <Link href={`/stories/${slug}`} className="relative aspect-video w-full overflow-hidden bg-zinc-50 block flex-shrink-0">
        <Image
          src={thumbnailSrc}
          alt={title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1400px) 25vw, 350px"
        />
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {categoryName && (
          <span className="text-[11px] font-bold text-[#FF4F18] mb-1.5 block tracking-wider">
            {categoryName}
          </span>
        )}

        <Link
          href={`/stories/${slug}`}
          className="font-serif font-bold text-[#0F172A] text-xl leading-snug line-clamp-2 hover:text-[#FF4F18] transition-colors mb-3 block"
        >
          {title}
        </Link>

        {excerpt && (
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-5">
            {excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-[12px] font-medium text-zinc-600 mt-auto">
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

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
          <time className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{publishDate}</time>
        </div>
      </div>
    </article>
  );
}
