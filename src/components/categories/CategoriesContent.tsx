"use client";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { useState, useEffect } from "react";
import { getCategories, getPlatformStats } from "@/lib/api";
import { Category } from "@/types";
import { getIcon } from "@/lib/icons";
import { Building2, TrendingUp, Sparkles } from "lucide-react";

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
            {/* Elegant Hero Section */}
            <section className="container-wide py-12 md:py-16 text-center border-b border-border/60">
                <div className="max-w-4xl mx-auto space-y-6 mb-10">
                    {title && (
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 font-serif tracking-tight leading-[1.1]"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    )}
                    <div className="max-w-3xl mx-auto space-y-4">
                        {description && (
                            <div className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                        {content && (
                            <div className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto opacity-80"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-6 text-sm text-zinc-500 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 py-2.5 px-5 w-fit mx-auto cursor-default">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div className="text-left leading-tight">
                            <div className="text-xl font-bold text-zinc-900 font-serif leading-none">
                                {stats.total_startups.toLocaleString()}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mt-0.5">Startups</div>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-zinc-200" />

                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="text-left leading-tight">
                            <div className="text-xl font-bold text-zinc-900 font-serif leading-none">
                                {stats.total_stories.toLocaleString()}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mt-0.5">Stories</div>
                        </div>
                    </div>
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
