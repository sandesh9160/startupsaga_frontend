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
      <article className="relative overflow-hidden rounded-[1.5rem] w-full h-[240px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Background image */}
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized={imageSrc.toLowerCase().endsWith(".svg")}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent" />

        {/* Tier Badge */}
        {tier && String(tier) !== '1' && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wide">
            Tier {tier}
          </div>
        )}

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-serif mb-1">
            {name}
          </h3>
          <p className="text-zinc-300 text-xs md:text-sm font-medium">
            {formattedStartupCount} startups
          </p>
        </div>
      </article>
    </Link>
  );
}
