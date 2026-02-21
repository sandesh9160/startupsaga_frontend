"use client";

import Link from "next/link";
import Image from "next/image";
import { getSafeImageSrc } from "@/lib/images";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CityCardProps {
  slug: string;
  name: string;
  image: string;
  startupCount: number;
  storyCount: number;
  unicornCount?: number;
  tier?: string;
}

export function CityCard({ slug, name, image, startupCount, storyCount, unicornCount, tier }: CityCardProps) {
  const imageSrc = getSafeImageSrc(image);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formattedStartupCount = isMounted ? startupCount.toLocaleString('en-IN') : String(startupCount || 0);

  return (
    <Link href={`/cities/${slug}`} className="block group min-w-0">
      <article className="relative overflow-hidden rounded-xl w-full h-40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {/* Background image */}
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized={imageSrc.toLowerCase().endsWith(".svg")}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Tier Badge */}
        {tier && (
          <div className={cn(
            "absolute top-3 right-3 px-2 py-0.5 rounded-full backdrop-blur-md border text-[9px] font-black uppercase tracking-wider shadow-lg",
            String(tier) === '2'
              ? "bg-orange-500/90 border-orange-400/50 text-white"
              : "bg-amber-500/90 border-amber-400/50 text-white"
          )}>
            Tier {tier}
          </div>
        )}

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-base font-bold text-white leading-tight drop-shadow">
            {name}
          </h3>
          <p className="text-white/80 text-xs font-medium mt-0.5">
            {formattedStartupCount} startups
            {unicornCount && unicornCount > 0 && (
              <>
                <span className="mx-1 opacity-50">•</span>
                <span className="text-blue-200">{unicornCount} {unicornCount === 1 ? 'unicorn' : 'unicorns'}</span>
              </>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
}
