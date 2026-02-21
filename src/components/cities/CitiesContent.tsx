"use client";

import { CityCard } from "@/components/cards/CityCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { getCities, getStories } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Building2, TrendingUp, Filter, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

export function CitiesContent() {
    const [cities, setCities] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | '1' | '2' | '3'>('all');
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
        Promise.all([
            getCities().then(setCities),
            getStories({ limit: 4 }).then(setStories)
        ])
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredCities = useMemo(() => {
        return filter === 'all'
            ? cities
            : cities.filter(c => String(c.tier).includes(filter));
    }, [cities, filter]);

    const totalStartups = useMemo(() =>
        cities.reduce((sum, c) => sum + (c.startupCount || 0), 0)
        , [cities]);

    const totalUnicorns = useMemo(() =>
        cities.reduce((sum, c) => sum + (c.unicornCount || 0), 0)
        , [cities]);

    // Format counts only after mounting to avoid locale mismatch during SSR
    const formattedStartups = isMounted ? totalStartups.toLocaleString('en-US') : "0";
    const formattedUnicorns = isMounted ? totalUnicorns.toLocaleString('en-US') : "0";

    return (
        <div className="bg-white min-h-screen">
            {/* Header / Hero Section - COMPACT VERSION */}
            <section className="container-wide pt-8 pb-4 md:pt-10 md:pb-6 text-center border-b border-zinc-50">
                <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600 mb-3 bg-orange-50 px-3 py-1 rounded-full border border-orange-100/50">
                    <MapPin className="h-3 w-3" />
                    Directory
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-zinc-900 mb-3 font-serif tracking-tight max-w-3xl mx-auto leading-tight">
                    Regional Startup Hubs in India
                </h1>

                <p className="text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
                    Explore entrepreneurial ecosystems across {cities.length || '100+'} cities, from tech metros to emerging Tier 2 & 3 innovation centers.
                </p>

                {/* Stats Section - Compact Horizontal */}
                <div className="flex items-center justify-center gap-8 py-4 px-6 bg-zinc-50/50 rounded-2xl w-fit mx-auto border border-zinc-100 mb-2">
                    <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-orange-600" />
                        <div className="text-left leading-none">
                            <span className="block text-lg font-bold text-zinc-900 tabular-nums leading-none">
                                {formattedStartups}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 block">Startups</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-zinc-200" />

                    <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <div className="text-left leading-none">
                            <span className="block text-lg font-bold text-zinc-900 tabular-nums leading-none">
                                {formattedUnicorns}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 block">Unicorns</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Filters Bar */}
            <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-100 shadow-sm">
                <div className="container-wide py-2.5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Filter Controls */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Filter className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                                    Hub Tiers:
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {[
                                    { id: 'all', label: 'All HUBs' },
                                    { id: '1', label: 'Metros' },
                                    { id: '2', label: 'Tier 2' },
                                    { id: '3', label: 'Tier 3' },
                                ].map((t) => (
                                    <Button
                                        key={t.id}
                                        variant={filter === t.id ? "accent" : "ghost"}
                                        onClick={() => setFilter(t.id as any)}
                                        className={cn(
                                            "px-3 py-1 h-7 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                            filter === t.id
                                                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                                                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                                        )}
                                    >
                                        {t.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation Links */}
                        <div className="hidden lg:flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-400">Quick view:</span>
                            <div className="flex gap-4">
                                <button onClick={() => setFilter('1')} className="text-orange-600 hover:underline">Metros</button>
                                <button onClick={() => setFilter('2')} className="text-orange-600 hover:underline text-blue-600">Emerging</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities Grid Section */}
            <section className="container-wide py-10 md:py-12">
                <div className="flex items-baseline justify-between mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-zinc-900 font-serif lowercase tracking-tight">
                        <span className="text-orange-600 mr-1.5 opacity-50">/</span> startup hubs
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        {filteredCities.length} hubs active
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 rounded-xl bg-zinc-100" />
                        ))}
                    </div>
                ) : filteredCities.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredCities.map((city) => (
                            <div key={city.slug} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <CityCard {...city} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-3xl">
                        <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">No matching hubs found</p>
                    </div>
                )}
            </section>

            {/* RELATED SECTIONS START */}
            <div className="bg-[#FDFDFD] border-t border-zinc-100">
                <section className="container-wide py-16 md:py-20 lg:py-24">
                    {/* City Related Stories matched to Screenshot 2 */}
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold font-serif text-zinc-900 leading-tight">Latest Hub Focused Stories</h2>
                            <Link href="/stories" className="text-orange-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                View all stories <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stories.length > 0 ? stories.slice(0, 4).map((story) => (
                                <StoryCard key={story.id} {...story} />
                            )) : (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="h-64 rounded-2xl bg-zinc-50 animate-pulse border border-zinc-100/50" />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stats Section matched to Screenshot 2 style (but for all Hubs) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center py-16 border-y border-zinc-100 mb-20 bg-white shadow-sm rounded-3xl">
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-1 font-serif">
                                {formattedStartups}+
                            </div>
                            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Verified Startups</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-1 font-serif">
                                {formattedUnicorns}+
                            </div>
                            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Unicorns & Soonicorns</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-1 font-serif">
                                25+
                            </div>
                            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Growth Tiers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-1 font-serif">
                                1M+
                            </div>
                            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Monthly Readers</div>
                        </div>
                    </div>

                    {/* Other Hubs grid matched to Screenshot 3 */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-bold font-serif text-zinc-900 mb-10">Explore Emerging Hubs</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {cities.filter(c => String(c.tier) === '2' || c.is_featured).slice(0, 7).map((hub) => (
                                <Link
                                    key={hub.slug}
                                    href={`/cities/${hub.slug}`}
                                    className="bg-white border border-zinc-100 p-4 rounded-xl text-center group hover:border-orange-200 hover:shadow-md transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform">
                                        <MapPin size={16} />
                                    </div>
                                    <h3 className="text-xs font-bold text-zinc-700 truncate">{hub.name}</h3>
                                    <p className="text-[8px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">{(hub.startupCount || 0).toLocaleString()}+ startups</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA Banner matched to Screenshot 3 */}
                    <div className="bg-[#FFF5F1] rounded-3xl p-8 md:p-12 border border-orange-100/50 relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 font-serif mb-3 tracking-tight">
                                Launching a Startup in India?
                            </h2>
                            <p className="text-zinc-600 text-base md:text-lg mb-8 leading-relaxed">
                                Get your journey featured on StartupSaga. We help you tell your story to India's largest entrepreneur community.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#0F172A] hover:bg-zinc-800 text-white font-bold transition-all active:scale-95">
                                    Submit Your Startup
                                </Button>
                                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-transparent border-zinc-200 font-bold hover:bg-white transition-all active:scale-95">
                                    Explore Directory
                                </Button>
                            </div>
                        </div>
                        {/* Abstract background shape */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 -mr-20 -mt-20 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </section>
            </div>
        </div>
    );
}
