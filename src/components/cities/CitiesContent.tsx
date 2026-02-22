"use client";

import { CityCard } from "@/components/cards/CityCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { getCities, getStories, getPlatformStats } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Building2, TrendingUp, Filter, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

export function CitiesContent() {
    const [cities, setCities] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | '1' | '2' | '3'>('all');
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [platformStats, setPlatformStats] = useState<any>({ total_startups: 0, total_unicorns: 0 });

    useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
        Promise.all([
            getCities().then(setCities),
            getStories({ limit: 4 }).then(setStories),
            getPlatformStats().then(setPlatformStats)
        ])
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredCities = useMemo(() => {
        return filter === 'all'
            ? cities
            : cities.filter(c => String(c.tier).includes(filter));
    }, [cities, filter]);

    const totalStartups = platformStats?.total_startups || 0;
    const totalUnicorns = platformStats?.total_unicorns || 0;

    // Format counts only after mounting to avoid locale mismatch during SSR
    const formattedStartups = isMounted && totalStartups > 0 ? totalStartups.toLocaleString('en-US') : "1";
    const formattedUnicorns = isMounted && totalUnicorns > 0 ? totalUnicorns.toLocaleString('en-US') : "1";

    return (
        <div className="bg-[#FAF9FB] min-h-screen font-sans">
            {/* Elegant Hero Section — Exact Match to Screenshot */}
            <section className="relative pt-24 pb-16 overflow-hidden bg-[#FAF5F2]">
                <div className="container-wide relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 font-serif tracking-tight max-w-4xl mx-auto leading-tight">
                        Startup Cities in India - Bengaluru, <br className="hidden md:block" />
                        Mumbai, Delhi NCR & More
                    </h1>

                    <div className="max-w-3xl mx-auto space-y-4 mb-10">
                        <p className="text-base md:text-lg text-zinc-500 leading-relaxed font-medium">
                            India's startup revolution extends far beyond Bengaluru. Explore thriving entrepreneurial
                            ecosystems in metros, emerging Tier 2 cities, and ambitious Tier 3 cities building the next wave
                            of innovation.
                        </p>
                        <p className="text-sm md:text-base text-zinc-500 leading-relaxed mb-6">
                            Each city profile features local unicorns, top-funded startups, leading investors, co-working spaces, and the
                            unique strengths shaping its startup culture.
                        </p>
                    </div>

                    {/* Stats Section exactly as in screenshot */}
                    <div className="flex items-center justify-center gap-6 py-2 px-4 mx-auto w-fit">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#FF5C00]" strokeWidth={2} />
                            <div className="text-left font-medium text-sm text-zinc-500 flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900">{formattedStartups}</span>
                                <span>Startups</span>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-zinc-300" />

                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#FF5C00]" strokeWidth={2} />
                            <div className="text-left font-medium text-sm text-zinc-500 flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900">{formattedUnicorns}</span>
                                <span>Unicorns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Filters Bar */}
            <div className="sticky top-[64px] z-30 bg-transparent py-4 pb-8 mt-8">
                <div className="container-wide">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-zinc-500 mr-2">
                                <Filter className="w-4 h-4" strokeWidth={2} />
                                <span className="text-sm font-medium">
                                    Filter by tier:
                                </span>
                            </div>

                            {[
                                { id: 'all', label: 'All Cities' },
                                { id: '1', label: 'Tier 1' },
                                { id: '2', label: 'Tier 2' },
                                { id: '3', label: 'Tier 3' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setFilter(t.id as any)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all border",
                                        filter === t.id
                                            ? "bg-[#FF5C00] text-white border-[#FF5C00] shadow-md shadow-orange-600/20"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Recommendation Links */}
                        <div className="hidden lg:flex items-center gap-3 text-sm font-medium">
                            <span className="text-zinc-500">Recommended:</span>
                            <div className="flex gap-4">
                                <button onClick={() => setFilter('2')} className="text-[#FF5C00] hover:underline font-semibold">Tier 2 Cities</button>
                                <button onClick={() => setFilter('3')} className="text-[#FF5C00] hover:underline font-semibold">Tier 3 Cities</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities Grid Section */}
            <main className="container-wide pb-12 relative z-20">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-40 rounded-2xl bg-white border border-zinc-100 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredCities.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {filteredCities.map((city) => (
                                <CityCard key={city.slug} {...city} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white max-w-2xl mx-auto">
                            <MapPin className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                            <p className="text-zinc-500 font-bold text-sm">No matching cities found for this tier.</p>
                            <Button onClick={() => setFilter('all')} variant="outline" className="mt-4 rounded-xl px-6">
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* RELATED SECTIONS START */}
            <div className="bg-[#FDFDFD] border-t border-zinc-100 mt-8">
                <section className="container-wide py-16 md:py-20 lg:py-24">
                    {/* City Related Stories */}
                    <div className="mb-20 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold font-serif text-zinc-900 leading-tight">Latest City Focused Stories</h2>
                            <Link href="/stories" className="text-orange-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                View all stories <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stories.length > 0 ? stories.slice(0, 4).map((story) => (
                                <StoryCard
                                    key={story.id || story.slug}
                                    slug={story.slug}
                                    title={story.title}
                                    excerpt={story.excerpt}
                                    thumbnail={story.thumbnail}
                                    og_image={story.og_image}
                                    category={story.category}
                                    categorySlug={story.category_slug}
                                    city={story.city}
                                    citySlug={story.city_slug}
                                    publishDate={story.publishDate || story.publish_date}
                                    author_name={story.author_name || story.author}
                                    read_time={story.read_time}
                                    featured={false}
                                    isFeatured={false}
                                />
                            )) : (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="h-64 rounded-2xl bg-zinc-50 animate-pulse border border-zinc-100/50" />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center py-16 border-y border-zinc-100 mb-20 bg-white shadow-sm rounded-3xl">
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

                    {/* Emerging Cities grid */}
                    <div className="mb-20 max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold font-serif text-zinc-900 mb-10">Explore Emerging Cities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {cities.filter(c => String(c.tier) === '2' || c.is_featured).slice(0, 7).map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/cities/${city.slug}`}
                                    className="bg-white border border-zinc-100 p-4 rounded-xl text-center group hover:border-orange-200 hover:shadow-md transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform">
                                        <MapPin size={16} />
                                    </div>
                                    <h3 className="text-xs font-bold text-zinc-700 truncate">{city.name}</h3>
                                    <p className="text-[8px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">{(city.startupCount || 0).toLocaleString()}+ startups</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <div className="max-w-7xl mx-auto bg-[#FFF5F1] rounded-3xl p-8 md:p-12 border border-orange-100/50 relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 font-serif mb-3 tracking-tight">
                                Launching a Startup in India?
                            </h2>
                            <p className="text-zinc-600 text-base md:text-lg mb-8 leading-relaxed">
                                Get your journey featured on StartupSaga. We help you tell your story to India's largest entrepreneur community.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#0F172A] hover:bg-zinc-800 text-white font-bold transition-all active:scale-95" asChild>
                                    <Link href="/submit">Submit Your Startup</Link>
                                </Button>
                                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-transparent border-zinc-200 font-bold hover:bg-white transition-all active:scale-95" asChild>
                                    <Link href="/startups">Explore Directory</Link>
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
