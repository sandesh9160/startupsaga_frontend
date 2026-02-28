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
        <div className="bg-[#FAF5F2] min-h-screen font-sans pb-16">
            {/* Full-width Hero Section - Match semantics */}
            <section className="bg-transparent relative z-10 pt-10 pb-10 border-b border-zinc-200">
                <div className="container-wide py-12 md:py-20 text-center">
                    <div className="max-w-4xl mx-auto space-y-7 mb-10">
                        {title && (
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-900 font-serif tracking-tight leading-[1.1]"
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        )}
                        <div className="max-w-3xl mx-auto space-y-5">
                            {description && (
                                <div className="text-base md:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto font-medium"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            )}
                            {content && (
                                <div className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-3xl mx-auto opacity-90"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            )}
                        </div>

                        {/* Enhanced Stats Display with Icons, Border and Background */}
                        <div className="inline-flex items-center gap-8 py-3.5 px-10 rounded-full border border-zinc-200 bg-white shadow-sm mt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Building2 className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-zinc-900">{stats.total_startups.toLocaleString()}</span>
                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Startups</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-zinc-200" />
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <TrendingUp className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-zinc-900">{stats.total_stories.toLocaleString()}</span>
                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Stories</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container-wide py-4 pb-24">
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
