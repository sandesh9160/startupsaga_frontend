"use client";

import { useState } from "react";
import Link from "next/link";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { CityCard } from "@/components/cards/CityCard";
import { Button } from "@/components/ui/button";
import {
    Building2,
    BookOpen,
    MapPin,
    Sparkles,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryDetailContentProps {
    category: any;
    categoryStartups: any[];
    categoryStories: any[];
    topCities: any[];
}

const CATEGORY_THEMES: Record<string, { bg: string; icon: string; border: string; accent: string; iconBg: string }> = {
    "fintech": { bg: "bg-[#E6F4F1]/10", icon: "text-[#00A884]", border: "border-[#00A884]/10", accent: "text-[#00A884]", iconBg: "bg-[#E6F4F1]" },
    "saas": { bg: "bg-[#E8F0FE]/10", icon: "text-[#1A73E8]", border: "border-[#1A73E8]/10", accent: "text-[#1A73E8]", iconBg: "bg-[#E8F0FE]" },
    "ecommerce": { bg: "bg-[#FEF1E8]/10", icon: "text-[#E67E22]", border: "border-[#E67E22]/10", accent: "text-[#E67E22]", iconBg: "bg-[#FEF1E8]" },
    "edtech": { bg: "bg-[#F3E8FF]/10", icon: "text-[#8E44AD]", border: "border-[#8E44AD]/10", accent: "text-[#8E44AD]", iconBg: "bg-[#F3E8FF]" },
    "healthtech": { bg: "bg-[#FEF2F2]/10", icon: "text-[#E74C3C]", border: "border-[#E74C3C]/10", accent: "text-[#E74C3C]", iconBg: "bg-[#FEF2F2]" },
    "mobility": { bg: "bg-[#E6F9F9]/10", icon: "text-[#00BCD4]", border: "border-[#00BCD4]/10", accent: "text-[#00BCD4]", iconBg: "bg-[#E6F9F9]" },
};

export function CategoryDetailContent({ category, categoryStartups, categoryStories, topCities }: CategoryDetailContentProps) {
    const [activeTab, setActiveTab] = useState<'startups' | 'stories'>('startups');
    const slugKey = category.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const theme = CATEGORY_THEMES[slugKey] || CATEGORY_THEMES["saas"];

    return (
        <div className="bg-[#F8F9FA] min-h-screen">
            {/* Header Content */}
            <header className="bg-white border-b border-zinc-200/60 pb-10 pt-8">
                <div className="container-wide">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
                        {/* Icon */}
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm", theme.iconBg)}>
                            {category.icon && typeof category.icon === "string" ? (
                                <img
                                    src={category.icon.startsWith("http") ? category.icon : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${category.icon}`}
                                    alt=""
                                    className="w-8 h-8 object-contain"
                                />
                            ) : <Sparkles className={cn("h-7 w-7", theme.icon)} />}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Category</div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 font-serif tracking-tight">
                                    {category.name} Startups in India
                                </h1>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-1.5 text-zinc-500 text-[12px] font-medium">
                                    <div className="w-5 h-5 rounded-md bg-zinc-50 flex items-center justify-center">
                                        <Building2 className="h-3 w-3 text-zinc-400" />
                                    </div>
                                    <span className="text-zinc-900 font-bold">{categoryStartups.length}</span> Startups
                                </div>
                                <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                <div className="flex items-center gap-1.5 text-zinc-500 text-[12px] font-medium">
                                    <div className="w-5 h-5 rounded-md bg-zinc-50 flex items-center justify-center">
                                        <BookOpen className="h-3 w-3 text-zinc-400" />
                                    </div>
                                    <span className="text-zinc-900 font-bold">{categoryStories.length}</span> Stories
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* About Card Section */}
            <div className="container-wide py-8 relative z-20">
                <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-6 md:p-8 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-zinc-900 font-serif mb-4">About {category.name} Startups in India</h2>
                    <div className="prose prose-zinc prose-sm max-w-none text-zinc-500 leading-relaxed space-y-4">
                        <p>{category.description || `The Indian ${category.name} ecosystem is undergoing a massive transformation, driven by digital adoption, innovative business models, and significant venture capital activity. From early-stage disruptors to established giants, these companies are redefining the landscape of the Indian economy.`}</p>
                        <p>Whether you're an entrepreneur exploring the {category.name} model, an investor scouting opportunities, or a professional considering joining a high-growth startup, StartupSaga's {category.name} category provides comprehensive coverage of funding announcements, founder stories, market analysis, and startup profiles.</p>
                    </div>
                </div>

                {/* Main Content Grid & Controls */}
                <div className="space-y-8 pb-32">
                    {/* Tab & Filter Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center p-1.5 bg-zinc-100/50 rounded-2xl w-fit">
                            <button
                                onClick={() => setActiveTab('startups')}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                                    activeTab === 'startups' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                                )}
                            >
                                <Building2 className="h-3.5 w-3.5" />
                                Startups ({categoryStartups.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('stories')}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                                    activeTab === 'stories' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                                )}
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                Stories ({categoryStories.length})
                            </button>
                        </div>

                        {/* Filters Placeholder */}
                        <div className="flex flex-wrap items-center gap-3">
                            {['All Cities', 'All Stages', 'All Years'].map((filter) => (
                                <button key={filter} className="px-4 py-2.5 bg-white border border-zinc-200/80 rounded-xl text-[11px] font-bold text-zinc-600 flex items-center gap-6 hover:bg-zinc-50 transition-colors">
                                    {filter}
                                    <ChevronDown className="h-3 w-3 text-zinc-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid */}
                    {activeTab === 'startups' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {categoryStartups.map((startup) => (
                                <StartupCard key={startup.slug} {...startup} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {categoryStories.map((story) => (
                                <StoryCard key={story.slug} {...story} />
                            ))}
                        </div>
                    )}

                    {/* Optional Footer Secton: Top Cities */}
                    <div className="pt-20 border-t border-zinc-200/60 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                                    <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-zinc-900 font-serif tracking-tight">Regional Hubs</h2>
                                </div>
                                <p className="text-sm text-zinc-400 font-medium">Top cities leading the {category.name} innovation.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topCities.map((city) => (
                                <CityCard key={city.slug} {...city} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
