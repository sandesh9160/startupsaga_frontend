"use client";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { useState, useEffect } from "react";
import { getCategories, getPlatformStats } from "@/lib/api";
import { Category } from "@/types";
import { getIcon } from "@/lib/icons";

interface CategoriesContentProps {
    title?: string;
    description?: string;
    content?: string;
}

export function CategoriesContent({
    title,
    description,
    content
}: CategoriesContentProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState({ total_startups: 0, total_stories: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getCategories(),
            getPlatformStats().catch(() => null),
        ]).then(([cats, platformStats]) => {
            setCategories(cats);
            if (platformStats) setStats({
                total_startups: platformStats.total_startups || 0,
                total_stories: platformStats.total_stories || 0
            });
        }).catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Header — same style as reference */}
            <section className="container-wide py-10 md:py-14 text-center">
                {title && (
                    <h1 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-4 font-serif tracking-tight max-w-4xl mx-auto leading-tight"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                )}
                <div className="max-w-3xl mx-auto space-y-3 mb-8">
                    {description && (
                        <div className="text-base md:text-lg text-zinc-500 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                    {content && (
                        <div className="text-[13px] text-zinc-400 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </div>

                <div className="flex justify-center items-center gap-10 text-sm text-zinc-500">
                    <span>
                        <span className="text-2xl font-semibold text-zinc-800 font-serif mr-1.5">
                            {stats.total_startups.toLocaleString()}
                        </span>
                        Startups
                    </span>
                    <span className="w-px h-5 bg-zinc-200" />
                    <span>
                        <span className="text-2xl font-semibold text-zinc-800 font-serif mr-1.5">
                            {stats.total_stories.toLocaleString()}
                        </span>
                        Stories
                    </span>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container-wide pb-24">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-[2rem] bg-zinc-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category.slug}
                                slug={category.slug}
                                name={category.name}
                                icon={getIcon(category.iconName || "help-circle")}
                                startupCount={(category as any).startup_count ?? category.startupCount ?? 0}
                                storyCount={(category as any).story_count ?? category.storyCount ?? 0}
                                description={category.description}
                                variant="horizontal"
                                paletteIndex={index}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
