"use client";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { useState, useEffect } from "react";
import { getCategories, getPlatformStats } from "@/lib/api";
import { Category } from "@/types";
import { getIcon } from "@/lib/icons";


export function CategoriesContent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState({ total_startups: 3160, total_stories: 861 });

    useEffect(() => {
        getCategories().then(setCategories).catch(err => console.error(err));
        getPlatformStats()
            .then(data => {
                if (data && data.total_startups) {
                    setStats(data);
                }
            })
            .catch(err => console.error("Failed to load platform stats", err));
    }, []);

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Header */}
            <section className="container-wide py-12 md:py-20 text-center">
                <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600 mb-6 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Market Landscape
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 font-serif tracking-tight max-w-4xl mx-auto leading-tight">
                    Indian Startup Categories — Fintech, SaaS, D2C & More
                </h1>
                <div className="max-w-3xl mx-auto space-y-4">
                    <p className="text-base md:text-lg text-zinc-500 leading-relaxed font-normal">
                        Navigate India's startup ecosystem by industry vertical. From fintech giants transforming payments to agritech innovators empowering farmers, discover the sectors driving India's economic transformation.
                    </p>
                    <p className="text-[13px] text-zinc-400 leading-relaxed">
                        Each category features curated startup profiles, funding news, founder interviews, and sector-specific insights to help you stay ahead of emerging trends.
                    </p>
                </div>

                {/* Impact Metrics */}
                <div className="flex justify-center gap-12 md:gap-20 mt-12 pb-6 border-b border-zinc-100 max-w-2xl mx-auto">
                    <div className="text-center group">
                        <div className="text-3xl md:text-4xl font-bold text-zinc-900 mb-1 font-serif group-hover:text-orange-600 transition-colors">
                            {stats.total_startups.toLocaleString()}
                        </div>
                        <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-400">Total Startups</div>
                    </div>
                    <div className="text-center group">
                        <div className="text-3xl md:text-4xl font-bold text-zinc-900 mb-1 font-serif group-hover:text-orange-600 transition-colors">
                            {stats.total_stories.toLocaleString()}
                        </div>
                        <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-400">Curated Stories</div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container-wide pb-12 px-5 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.slug}
                            {...category}
                            icon={getIcon(category.iconName || "help-circle")}
                            variant="banner"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
