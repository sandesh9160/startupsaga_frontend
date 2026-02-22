"use client";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { useState, useEffect } from "react";
import { getCategories, getPlatformStats } from "@/lib/api";
import { Category } from "@/types";
import { getIcon } from "@/lib/icons";

export function CategoriesContent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState({ total_startups: 0, total_stories: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getCategories(),
            getPlatformStats().catch(() => null),
        ]).then(([cats, platformStats]) => {
            setCategories(cats);
            if (platformStats?.total_startups) setStats(platformStats);
        }).catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Header — same style as reference */}
            <section className="container-wide py-12 md:py-16 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-5 font-serif tracking-tight max-w-4xl mx-auto leading-tight">
                    Indian Startup Categories — Fintech, SaaS, D2C &amp; More
                </h1>
                <div className="max-w-3xl mx-auto space-y-3 mb-8">
                    <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
                        Navigate India's startup ecosystem by industry vertical. From fintech giants transforming payments to agritech innovators empowering farmers, discover the sectors driving India's economic transformation.
                    </p>
                    <p className="text-[13px] text-zinc-400 leading-relaxed">
                        Each category features curated startup profiles, funding news, founder interviews, and sector-specific insights to help you stay ahead of emerging trends.
                    </p>
                </div>

                {/* Stats row */}
                <div className="flex justify-center items-center gap-10 text-sm text-zinc-500">
                    <span>
                        <span className="text-2xl font-bold text-zinc-900 font-serif mr-1.5">
                            {stats.total_startups ? stats.total_startups.toLocaleString() : "—"}
                        </span>
                        Startups
                    </span>
                    <span className="w-px h-5 bg-zinc-200" />
                    <span>
                        <span className="text-2xl font-bold text-zinc-900 font-serif mr-1.5">
                            {stats.total_stories ? stats.total_stories.toLocaleString() : "—"}
                        </span>
                        Stories
                    </span>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container-wide pb-14">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-zinc-200 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category.slug}
                                slug={category.slug}
                                name={category.name}
                                icon={getIcon(category.iconName || "help-circle")}
                                startupCount={category.startupCount ?? 0}
                                storyCount={category.storyCount ?? 0}
                                description={category.description}
                                variant="banner"
                                paletteIndex={index}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
